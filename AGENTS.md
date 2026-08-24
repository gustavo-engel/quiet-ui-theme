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

## Dependências

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
