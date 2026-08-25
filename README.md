# CyberSafe — Conecte-se com respeito

Site educacional, moderno e responsivo sobre **cyberbullying, segurança e cidadania digital**.

## Estrutura

```text
cyberbullying/
├── index.html
├── style.css
├── script.js
├── README.md
└── assets/
    ├── images/
    └── icons/
```

As pastas `assets/images` e `assets/icons` ficam disponíveis para futuras imagens/ícones personalizados. O projeto atual utiliza ícones do Font Awesome e Google Fonts por CDN, sem necessidade de frameworks.

## Como executar

1. Crie/extraia a pasta `cyberbullying`.
2. Abra a pasta no Visual Studio Code.
3. Abra o arquivo `index.html`.
4. Abra o `index.html` diretamente no navegador.

Não é necessário Node.js, npm, servidor local ou framework.

> Observação: as fontes e os ícones carregados por CDN precisam de conexão com a internet para aparecerem. O restante do projeto funciona como arquivos locais.

## Tecnologias

- HTML5 semântico
- CSS3
- JavaScript puro
- Google Fonts
- Font Awesome via CDN
- Intersection Observer para animações de entrada
- LocalStorage para preferência de tema
- Media queries para responsividade
- `prefers-reduced-motion` para acessibilidade

## Funcionalidades

- Header fixo com efeito glassmorphism
- Menu hamburger no celular
- Navegação suave
- Indicador da seção atual
- Barra de progresso de leitura
- Tema claro/escuro
- Animações de entrada
- Cards interativos
- Modais educativos
- Mitos e verdades
- Quiz com 10 perguntas e pontuação
- Simulador com 5 situações
- Accordion de FAQ
- Botão voltar ao topo
- Layout responsivo
- Acessibilidade básica com foco, labels e redução de movimento

## Personalização

### Cores
As principais cores estão no começo do `style.css`, dentro de `:root`. Para mudar a identidade visual, altere as variáveis:

```css
--primary
--primary-2
--accent
--bg
--text
--muted
```

### Quiz
As perguntas estão no array `quizQuestions` dentro do `script.js`.

### Simulador
As situações estão no array `scenarios` dentro do `script.js`.

### Tipos de cyberbullying
Os cards estão no array `typeData` dentro do `script.js`.

## Responsabilidade

O projeto foi construído para educação e conscientização. Os exemplos são fictícios e não reproduzem conteúdo ofensivo real.

O site não substitui orientação profissional. Em situações concretas, é importante procurar uma pessoa adulta de confiança e, quando necessário, orientação adequada das instituições ou plataformas responsáveis.

Contatos oficiais devem sempre ser confirmados em fontes oficiais e atualizadas antes de serem publicados no site.

## Licença

Você pode adaptar o projeto para trabalhos escolares, projetos pessoais e apresentações educacionais.
