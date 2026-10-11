# Vitrine Glauber - Interface

Interface demonstrativa da Vitrine Glauber, plataforma pública digital dos boxes e expositores do Centro Cultural Glauber Rocha, em Vitória da Conquista - BA.

## Tecnologias

- Vue.js 3 com Composition API
- Quasar Framework
- Pinia
- Vue Router
- Vite

## Telas incluídas

- Página inicial de apresentação e descoberta
- Catálogos completos de boxes e produtos
- Perfil público e compartilhável de cada box
- Página compartilhável de cada produto
- Filtros sincronizados com a URL
- Páginas Sobre, Como visitar, Acessibilidade e Privacidade
- Estados de carregamento, erro recuperável e resultado vazio
- Tema claro e escuro
- Controles de tamanho de texto e alto contraste

Os dados e contatos presentes na demonstração são fictícios e devem ser substituídos antes da publicação.

## Executar localmente

```bash
npm install
npm run dev
```

Acesse `http://127.0.0.1:4173`.

## Compilar para produção

```bash
npm run build
```

Os arquivos prontos para hospedagem serão gerados em `dist/`.

## Configuração de hospedagem

O projeto usa histórico de navegação do navegador. Em produção, configure o servidor para redirecionar rotas desconhecidas para `index.html`. Assim, endereços como `/boxes/barro-da-serra` e `/produtos/caneca-serra` também funcionam quando abertos diretamente.
