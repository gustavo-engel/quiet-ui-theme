# Quiet UI

Quiet UI é um tema administrativo aberto, modular e independente. Ele reúne
componentes individuais, páginas de referência e padrões de interação bem
catalogados para acelerar a criação de novas interfaces.

A estrutura foi pensada para ser fácil de adaptar, ampliar e combinar com
diferentes modelos de aplicação. As convenções visuais e semânticas também
permitem que agentes de IA entendam o projeto, reutilizem seus componentes e
criem novas páginas sem descaracterizar o design.

## Princípios

- componentes independentes e reutilizáveis;
- catálogo visual que também funciona como documentação viva;
- CSS e JavaScript centralizados;
- HTML semântico, acessível e previsível;
- adaptação por tokens e contratos, sem duplicar estilos;
- estrutura legível para pessoas e agentes de IA.

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
├── AGENTS.md           # regras para agentes de IA
├── PROMPT.md           # prompt para novas páginas
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

## Continuidade com agentes de IA

Antes de alterar o tema, um agente deve ler [`AGENTS.md`](AGENTS.md), este README
e a documentação visual em [`docs.html`](docs.html). Para solicitar uma nova
página, use [`PROMPT.md`](PROMPT.md) como ponto de partida.

Esses arquivos definem o vocabulário visual, as responsabilidades de cada
arquivo e as verificações necessárias para que extensões futuras permaneçam
compatíveis com o catálogo existente.

As fotografias da timeline são exemplos remotos com crédito no próprio HTML.
Substitua-as por arquivos do projeto ao usar o tema sem conexão.

## Validar

```bash
python3 validate.py
node --check assets/js/vendor.js
node --check assets/js/theme.js
```
