# Quiet UI

Tema administrativo estático extraído do design do portal. Ele não depende do
FastAPI, do banco ou de dados escolares.

## Abrir

Na raiz do repositório:

```bash
python3 -m http.server 4173
```

Acesse `http://127.0.0.1:4173`.

## Estrutura

```text
.
├── index.html          # dashboard
├── forms.html          # formulários e validação
├── calendar.html       # calendário mensal
├── timeline.html       # timeline vertical com fotografias
├── components.html     # chips, menus, tabs, modal, toast e tabela
├── charts.html         # Chart.js + alternativas textuais
├── loading.html        # loading states nomeados em inglês
├── docs.html           # documentação viva
└── assets/
    ├── css/theme.css   # único CSS autoral
    └── js/
        ├── vendor.js   # bibliotecas e versões
        └── theme.js    # todos os comportamentos próprios
```

## Reutilizar

1. Copie `assets/` e a página mais parecida com a que você precisa.
2. Troque textos e dados fictícios.
3. Personalize os tokens no início de `assets/css/theme.css`.
4. Mantenha classes `.ui-*`, estados `.is-*` e ganchos `data-ui-*`.
5. Declare em `data-vendors` somente as bibliotecas usadas na página.
6. Para fotos, mantenha `alt`, dimensões, `figure/figcaption` e a origem do arquivo.

Exemplo básico:

```html
<script src="assets/js/vendor.js" data-vendors="poppins,lucide"></script>
<link rel="stylesheet" href="assets/css/theme.css">
<script src="assets/js/theme.js" defer></script>
```

## Bibliotecas

As URLs e versões ficam somente em `assets/js/vendor.js`:

- Chart.js 4.5.1;
- Lucide 1.34.0;
- Poppins via Google Fonts.

O layout e os componentes são HTML, CSS e JavaScript próprios. Chart.js só é
carregado em páginas que exibem gráficos. Em produção, prefira hospedar fontes e
bibliotecas localmente.

## Contratos reutilizáveis

- `.ui-*`: componente;
- `.is-*`: estado visual ou de domínio;
- `data-ui-*`: comportamento JavaScript;
- `--ui-space-*`: ritmo de espaçamento;
- `role`, `aria-*`, `time`, `figure`, `figcaption` e `dl`: semântica preservada.

As fotografias da timeline são exemplos remotos com crédito no próprio HTML.
Substitua-as por arquivos do projeto ao usar o tema sem conexão.

## Validar

```bash
python3 validate.py
node --check assets/js/vendor.js
node --check assets/js/theme.js
```

O arquivo [`PROMPT.md`](PROMPT.md) contém uma solicitação curta para criar novas
páginas com este tema.
