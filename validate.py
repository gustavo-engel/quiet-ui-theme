"""Validação leve e sem dependências para os arquivos do Quiet UI."""

from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
SUPPORTED_LANGS = {"pt-BR", "en"}
EXPECTED_PAGES = {
    "index.html",
    "forms.html",
    "authentication.html",
    "login-centered.html",
    "login-split.html",
    "login-enterprise.html",
    "calendar.html",
    "timeline.html",
    "components.html",
    "flags.html",
    "datatables.html",
    "charts.html",
    "loading.html",
    "profile.html",
    "docs.html",
}


class PageParser(HTMLParser):
    """Coleta contratos estruturais relevantes sem tentar validar HTML5 inteiro."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.references: list[tuple[str, str]] = []
        self.fragments: list[str] = []
        self.button_types: list[str | None] = []
        self.main_count = 0
        self.h1_count = 0
        self.title_count = 0
        self.lang: str | None = None
        self.has_charset = False
        self.has_viewport = False
        self.inline_handlers: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        element_id = values.get("id")
        if element_id:
            self.ids.append(element_id)
        if tag == "html":
            self.lang = values.get("lang")
        elif tag == "main":
            self.main_count += 1
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "title":
            self.title_count += 1
        elif tag == "meta":
            self.has_charset = self.has_charset or values.get("charset") == "utf-8"
            self.has_viewport = self.has_viewport or values.get("name") == "viewport"
        elif tag == "button":
            self.button_types.append(values.get("type"))

        for attribute in ("href", "src"):
            target = values.get(attribute)
            if target:
                self.references.append((attribute, target))
                if target.startswith("#"):
                    self.fragments.append(unquote(target[1:]))

        self.inline_handlers.extend(name for name, _ in attrs if name.startswith("on"))


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def validate_page(path: Path) -> list[str]:
    parser = parse_page(path)
    errors: list[str] = []
    prefix = path.relative_to(ROOT).as_posix()

    if parser.lang not in SUPPORTED_LANGS:
        allowed = ", ".join(sorted(SUPPORTED_LANGS))
        errors.append(f"{prefix}: <html> precisa usar um lang suportado ({allowed})")
    if not parser.has_charset:
        errors.append(f"{prefix}: meta charset ausente")
    if not parser.has_viewport:
        errors.append(f"{prefix}: meta viewport ausente")
    if parser.title_count != 1:
        errors.append(f"{prefix}: esperado exatamente um <title>")
    if parser.main_count != 1:
        errors.append(f"{prefix}: esperado exatamente um <main>")
    if parser.h1_count != 1:
        errors.append(f"{prefix}: esperado exatamente um <h1>")

    duplicate_ids = [name for name, count in Counter(parser.ids).items() if count > 1]
    if duplicate_ids:
        errors.append(f"{prefix}: IDs duplicados: {', '.join(sorted(duplicate_ids))}")

    missing_fragments = sorted(set(parser.fragments) - set(parser.ids))
    if missing_fragments:
        errors.append(f"{prefix}: fragmentos ausentes: {', '.join(missing_fragments)}")

    if any(button_type not in {"button", "submit", "reset"} for button_type in parser.button_types):
        errors.append(f"{prefix}: todo <button> precisa declarar type")
    if parser.inline_handlers:
        errors.append(f"{prefix}: handlers inline não são permitidos")

    for attribute, raw_target in parser.references:
        parsed = urlparse(raw_target)
        if parsed.scheme or raw_target.startswith(("#", "//", "mailto:", "tel:")):
            continue
        target = unquote(parsed.path)
        if not target:
            continue
        resolved = (path.parent / target).resolve()
        try:
            resolved.relative_to(ROOT)
        except ValueError:
            errors.append(f"{prefix}: {attribute} escapa da pasta theme: {raw_target}")
            continue
        if not resolved.exists():
            errors.append(f"{prefix}: referência ausente em {attribute}: {raw_target}")

    return errors


def main() -> int:
    pages = {path.name for path in ROOT.glob("*.html")}
    errors: list[str] = []
    missing_pages = EXPECTED_PAGES - pages
    unexpected_pages = pages - EXPECTED_PAGES
    if missing_pages:
        errors.append(f"Páginas ausentes: {', '.join(sorted(missing_pages))}")
    if unexpected_pages:
        errors.append(f"Páginas não catalogadas: {', '.join(sorted(unexpected_pages))}")

    for page_name in sorted(EXPECTED_PAGES & pages):
        errors.extend(validate_page(ROOT / page_name))

    index_references = {
        target.split("#", 1)[0]
        for _, target in parse_page(ROOT / "index.html").references
    }
    linked_elsewhere = set(index_references)
    for path in ROOT.glob("*.html"):
        linked_elsewhere.update(
            target.split("#", 1)[0] for _, target in parse_page(path).references
        )
    unlinked = {
        page
        for page in EXPECTED_PAGES
        if page != "index.html" and page not in linked_elsewhere
    }
    if unlinked:
        errors.append(f"Páginas sem link interno: {', '.join(sorted(unlinked))}")

    if errors:
        print("Tema inválido:")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Tema válido: {len(EXPECTED_PAGES)} páginas e referências locais íntegras.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
