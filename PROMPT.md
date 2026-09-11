# Prompt para agentes de IA

```text
Crie {{PÁGINA}} dentro do tema Quiet UI existente.

Antes de editar, leia AGENTS.md, README.md e consulte docs.html.
O Quiet UI é um tema administrativo independente, modular e aberto à expansão.

Reutilize o shell, os tokens e os componentes de assets/css/theme.css.
Use os comportamentos data-ui-* já disponíveis em assets/js/theme.js.
Declare bibliotecas somente pelo manifesto assets/js/vendor.js.

Para tabelas exportáveis, copie o exemplo completo de docs.html#export-contract.
Ofereça PDF, Excel (.xlsx), CSV, JSON e Imprimir pelos ganchos existentes,
acima da busca, com IDs únicos, título e nome do arquivo próprios.
Exporte todos os resultados filtrados e ordenados carregados, incluindo outras
páginas. Dados paginados no servidor exigem integração com a fonte completa.
CSV/JSON funcionam sem rede; PDF/Excel precisam das bibliotecas do manifesto
(locais para uso offline). CSV não é XLSX; Imprimir/Salvar como PDF não é
a geração direta de PDF. Preserve loading, erros, mensagens acessíveis e
restauração da página após imprimir ou cancelar.

Para o rodapé, siga docs.html#footer-contract e personalize nome, descrição,
versão/data e autoria. Reutilize as classes existentes; créditos devem refletir
as dependências usadas. Não duplique um rodapé data-ui-footer já presente.

Para autenticação, consulte authentication.html e docs.html#auth-contract.
Copie um dos três modelos e preserve os botões SSO com logos locais.
Mantenha a demonstração sem transmissão de credenciais; integração real exige
substituir o handler demo pelo backend, conforme o contrato documentado.

Mantenha:
- sidebar azul-marinho, fundo claro e cards brancos (modelos de login usam
  layout independente, sem sidebar ou barra de usuário autenticado);
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
- “uma data table com ordenação, estados semânticos e barras de progresso”;
- “uma tela de configurações com abas e formulário”;
- “um detalhe de projeto com histórico e comentários”.
