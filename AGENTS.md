# AGENTS.md

## Escopo

Este diretório contém o Quiet UI, um tema administrativo independente, modular
e aberto à expansão. Ele não possui relação arquitetural ou conceitual com
outros projetos que possam existir no mesmo computador.

O objetivo é manter uma biblioteca de componentes individuais, páginas de
referência e padrões de interação fáceis de entender, adaptar e reutilizar.

## Fontes oficiais

- `assets/css/theme.css`: tokens, layout, componentes, responsividade e animações;
- `assets/js/theme.js`: comportamentos próprios e navegação central;
- `assets/js/vendor.js`: manifesto das bibliotecas externas;
- `docs.html`: documentação visual viva;
- `README.md`: visão geral e instruções de reutilização;
- `PROMPT.md`: solicitação-base para criação de novas páginas.

Não crie CSS ou JavaScript paralelo sem necessidade comprovada. Amplie primeiro
as fontes oficiais existentes.

## Contrato visual e semântico

- classes `.ui-*` identificam componentes;
- modificadores `.is-*` representam estado ou variação;
- atributos `data-ui-*` conectam comportamentos JavaScript;
- tokens `--ui-*` centralizam cor, espaço, raio, sombra e movimento;
- cada página possui um único `h1`, regiões semânticas e hierarquia clara;
- estados não dependem apenas de cor ou animação;
- imagens usam `alt`, dimensões explícitas e crédito quando necessário;
- carregamentos mantêm mensagem textual, `aria-busy` e movimento reduzido;
- dados de exemplo são genéricos, fictícios e livres de informações privadas.

Use HTML nativo antes de criar abstrações. Prefira `nav`, `main`, `section`,
`article`, `ol`, `time`, `figure`, `figcaption`, `dl`, `dialog`, `button`,
`fieldset` e controles de formulário reais.

## Criação e alteração de componentes

### Índice de referência para agentes

Use cada página como exemplo executável e copie a estrutura completa, não apenas
o elemento visual. Consulte seus atributos `data-ui-*` em `theme.js` para conferir
eventos, estados e inicialização antes de adaptar:

- `forms.html`: campos com ícones, seleção, validação e textos auxiliares;
- `components.html`: chips, menus, abas, modal, toast e tabela básica;
- `datatables.html` e `docs.html#export-contract`: busca, filtros, ordenação,
  paginação e os cinco formatos de saída;
- `authentication.html` e `docs.html#auth-contract`: três layouts de login,
  senha visível, estados demonstrativos e integração local/SSO;
- `profile.html`: conta, avatar, capa, segurança e preferências;
- `calendar.html`: navegação mensal, eventos e categorias;
- `timeline.html`: marcos de projeto, fotos, descrições e créditos;
- `charts.html`: gráficos e alternativas textuais;
- `loading.html`: spinners, skeletons e estados de carregamento;
- `flags.html`: códigos de países, busca e bandeiras;
- `docs.html#notification-contract`: persistência demonstrativa e integração
  externa de notificações;
- `docs.html#footer-contract`: marca, versão/data, autoria e rodapé próprio.

Os exemplos são demonstrações de interface: não presuma backend, autenticação
real ou persistência no servidor. Documente explicitamente qualquer integração
adicionada e mantenha este índice atualizado ao ampliar o catálogo.

Ao criar uma página ou componente:

1. reutilize o shell e os tokens existentes;
2. verifique se um componente equivalente já existe;
3. mantenha o CSS em `theme.css` e o comportamento em `theme.js`;
4. adicione ganchos `data-ui-*` somente quando houver comportamento;
5. preserve teclado, foco visível, responsividade e `prefers-reduced-motion`;
6. ofereça equivalente textual para gráficos e informações visuais;
7. documente o padrão em `docs.html` ou em uma página de catálogo;
8. atualize a navegação central e `EXPECTED_PAGES` ao adicionar páginas;
9. use conteúdo demonstrativo que explique claramente a finalidade do padrão.

Novas páginas podem representar qualquer modelo administrativo ou operacional,
desde que mantenham o vocabulário do Quiet UI.

## Exportações e rodapé

Antes de criar tabelas exportáveis, consulte o exemplo completo e o contrato em
`docs.html#export-contract` e as duas tabelas funcionais em `datatables.html`.
Copie o componente completo: raiz, ações antes da busca, controles, tabela,
linhas, paginação e região de mensagens. Troque todos os IDs e referências
associadas; configure título e nome do arquivo sem extensão.

- Em `data-ui-table-export`, use um valor por botão:
  `pdf`, `excel`, `csv`, `json` ou `print`.
  Os cinco formatos já têm implementação central em `theme.js`.
- Preserve filtros, ordenação e todas as páginas carregadas. O tema lê as linhas
  presentes na inicialização: dados paginados no servidor ou carregados depois
  exigem integração própria com a fonte de dados, incluindo os filtros ativos.
- PDF gera um arquivo diretamente; Imprimir abre o diálogo do navegador, que pode
  oferecer Salvar como PDF. CSV é texto tabular; Excel é um arquivo XLSX.
- CSV/JSON dispensam rede e bibliotecas. PDF/Excel usam o manifesto central;
  para funcionar offline, disponibilize essas bibliotecas localmente.
- Preserve nomes de arquivo, estados vazio/loading/erro, avisos acessíveis,
  proteção contra fórmulas no CSV e restauração após imprimir ou cancelar.
  Não apresente o download preparado como confirmação de que o usuário salvou.
- Ao adaptar o rodapé, consulte `docs.html#footer-contract`: personalize nome,
  descrição, versão/data e autoria. Um `footer[data-ui-footer]` dentro de
  `.ui-workspace` substitui o padrão gerado, sem duplicação.
  Créditos devem refletir as dependências realmente utilizadas.

## Ações em tabelas

Para ações por registro em qualquer tabela, consulte `docs.html#table-actions-contract`.
Reutilize `ui-button is-secondary ui-table-action`, ícone e texto visíveis, nome
acessível com contexto e `ui-table-actions` para grupos. Links navegam; botões
executam operações. Não transforme links comuns ou itens de menu em botões.

## Copy to Clipboard

Consulte `docs.html#copy-contract` e `components.html#copy-title`. Reutilize
`.ui-copy` e botão `type="button"` com `data-ui-copy-target="id"`, apontando
somente para o conteúdo. Use `data-ui-copy-box` para clique na caixa, nunca
em campos editáveis. `data-ui-copy-docs` transforma todos os pre do contêiner
na inicialização; não combine com caixas manuais no mesmo contêiner.
Preserve seleção manual, valor atual, espaços, teclado e status independente.
Não copie senhas por padrão; não registre conteúdo. Clipboard exige contexto
seguro e pode ser bloqueado: mantenha erro e orientação manual, sem sucesso falso.

## Modelos de autenticação (integração)

Consulte `authentication.html` e `docs.html#auth-contract` antes de criar login.
Use os três modelos independentes com usuário/senha e botões Microsoft, CyberArk
e Google. As páginas completas têm .ui-workspace e rodapé, sem topbar/sidebar.
Preserve labels, autocomplete, mostrar senha, teclado, loading e status acessível.

`data-ui-auth-demo` identifica simulação: não transmita, registre ou persista
credenciais. O fieldset começa disabled e só é habilitado depois da instalação
do bloqueio de submit. SSO usa botões type=button fora do formulário, sem validar
os campos locais. Para integrar, remova o modo demo, configure o POST local no
backend e conecte os botões às rotas reais de início de SSO da aplicação.
Não simule uma sessão autenticada nem coloque segredos de cliente no browser.
Use os assets de assets/logos e preserve suas proporções e cores; fontes e
condições constam no README dessa pasta.

## Bibliotecas externas

O núcleo visual usa HTML e CSS próprios. As dependências externas são declaradas
somente em `assets/js/vendor.js` e carregadas por página quando necessárias.

Não introduza frameworks de CSS ou frameworks JavaScript pesados sem uma decisão
explícita e documentada.

## Validação obrigatória

Antes de concluir uma alteração, execute:

```bash
python3 validate.py
node --check assets/js/vendor.js
node --check assets/js/theme.js
```

Confirme também que todas as páginas catalogadas abrem, que referências locais
existem e que nenhuma informação sensível foi adicionada.
