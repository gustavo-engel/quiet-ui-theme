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
├── authentication.html # catálogo de modelos de autenticação
├── login-centered.html # login em card central
├── login-split.html    # login com painel de identidade
├── login-enterprise.html # login local e SSO lado a lado
├── calendar.html       # calendário mensal
├── timeline.html       # timeline vertical com fotografias
├── components.html     # chips, menus, tabs, modal, toast e tabela
├── flags.html          # bandeiras por código ISO, busca e padrões de uso
├── datatables.html     # tabelas com busca, filtros, ordenação e paginação
├── charts.html         # Chart.js + alternativas textuais
├── loading.html        # loading states nomeados em inglês
├── profile.html        # perfil, segurança, notificações e preferências
├── docs.html           # documentação viva
├── AGENTS.md           # regras para agentes de IA
├── PROMPT.md           # prompt para novas páginas
└── assets/
    ├── css/theme.css   # único CSS autoral
    └── js/
        ├── vendor.js   # bibliotecas e versões
        └── theme.js    # shell, notificações e comportamentos próprios
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
- jsPDF 4.2.1 + jsPDF-AutoTable 5.0.8;
- Lucide 1.34.0;
- Poppins via Google Fonts;
- SheetJS CE 0.20.3.

O layout e os componentes são HTML, CSS e JavaScript próprios. Chart.js só é
carregado em páginas que exibem gráficos; as bibliotecas de exportação são
carregadas somente quando o usuário solicita um arquivo. Em produção, prefira
hospedar fontes e bibliotecas localmente.

## Contratos reutilizáveis

- `.ui-*`: componente;
- `.is-*`: estado visual ou de domínio;
- `data-ui-*`: comportamento JavaScript;
- `--ui-space-*`: ritmo de espaçamento;
- `role`, `aria-*`, `time`, `figure`, `figcaption` e `dl`: semântica preservada.
- `[data-ui-data-table]`: tabela funcional; linhas expõem valores ordenáveis e filtráveis em `data-*`, e `[data-ui-table-export]` reutiliza o conjunto filtrado.
- `[data-ui-notification-center]`: sino global com histórico, contador e leitura persistida no modo demonstrativo.
- `[data-ui-footer]`: rodapé global; versão, data e autoria ficam centralizadas em `themeRelease` no `theme.js`.
- `[data-ui-flag]`: bandeira Unicode gerada a partir do código ISO, sem imagens ou dependência adicional.

## Exportações e personalização do rodapé

Consulte o [exemplo completo de exportação](docs.html#export-contract) para
reutilizar PDF, Excel (.xlsx), CSV, JSON e impressão nas suas tabelas.
Todos usam os resultados filtrados e ordenados carregados, incluindo outras
páginas. Paginação no servidor exige integração com a fonte completa.
CSV/JSON funcionam sem rede; PDF/Excel precisam das bibliotecas do manifesto,
hospedadas localmente para uso offline. CSV não equivale a XLSX.

O [contrato do rodapé](docs.html#footer-contract) mostra como adaptar marca,
descrição, versão/data e autoria ou fornecer seu próprio HTML sem duplicação.

## Copy to Clipboard

O [componente de cópia](components.html#copy-title) funciona com campos editáveis
e caixas de código. O [contrato completo](docs.html#copy-contract) inclui HTML
copiável, seleção manual, estados acessíveis e tratamento de permissões.
O guia já permite copiar cada bloco pelo ícone ou pelo clique na caixa.

## Autenticação

O [catálogo](authentication.html) oferece três layouts com usuário/senha e
botões Microsoft (Entra ID), CyberArk e Google. Os modelos são demonstrações:
não enviam credenciais nem criam sessão. Incluem validação, mostrar senha,
loading e seleção de resultado em “Testar estados”.
Consulte o [guia de integração](docs.html#auth-contract) para substituir o modo
demo por autenticação local ou SSO no seu backend e o
[registro dos logos](assets/logos/README.md) para a origem dos assets.

## Centro de notificações

O exemplo da barra superior usa `localStorage` versionado apenas para demonstrar
persistência no dispositivo. Abrir o painel não marca itens como lidos; a
alteração só aparece depois que o novo estado é salvo.

Em aplicações reais, defina `data-notification-mode="external"` no `body` e
conecte os eventos `quietui:notification:read-request` e
`quietui:notifications:read-all-request` ao backend. A aplicação confirma o
resultado por `window.QuietUI.notifications.upsert()` ou `replace()`. Use IDs
estáveis e o horário real do evento, como o `finished_at` de uma sincronização.

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
