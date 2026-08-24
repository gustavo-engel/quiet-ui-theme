# Prompt para agentes de IA

```text
Crie {{PÁGINA}} dentro do tema Quiet UI existente.

Antes de editar, leia AGENTS.md, README.md e consulte docs.html.
O Quiet UI é um tema administrativo independente, modular e aberto à expansão.

Reutilize o shell, os tokens e os componentes de assets/css/theme.css.
Use os comportamentos data-ui-* já disponíveis em assets/js/theme.js.
Declare bibliotecas somente pelo manifesto assets/js/vendor.js.

Mantenha:
- sidebar azul-marinho, fundo claro e cards brancos;
- classes .ui-*, estados .is-* e HTML semântico;
- espaçamento generoso usando os tokens --ui-space-*;
- foco visível, teclado, mobile e prefers-reduced-motion;
- um h1, uma ação primária e estados vazio/loading/erro quando aplicáveis;
- fotografias em figure/figcaption, com alt, dimensões e crédito quando aplicáveis;
- loading states com mensagem visível, aria-busy e nomes de componentes em inglês;
- dados fictícios e genéricos.

Não crie outro CSS ou JS para a página sem necessidade comprovada.
Entregue a página funcional, atualize a navegação central e rode python3 validate.py.
```

Substitua `{{PÁGINA}}` por algo direto, como:

- “uma lista de clientes com busca, filtros e paginação”;
- “uma tela de configurações com abas e formulário”;
- “um detalhe de projeto com histórico e comentários”.
