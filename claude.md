# Projeto Yeezus

## Visão Geral
Este arquivo é preparado para ser lido por um modelo como Claude. Ele descreve o projeto, a estrutura de arquivos e os pontos principais de desenvolvimento.

## Objetivo do Projeto
Aplicação web React simples para autenticação e navegação entre páginas como Cadastro, Entrar, Início e Sobre, além de um chat com um componente Bear.

## Funcionalidades
- Sistema de controle financeiro funcional
- Relatórios financeiros básicos
- Dashboard inicial com gráficos
- Planejamento de orçamento automático implementado

## Tecnologia
- React + JSX
- Vite
- JavaScript / TypeScript misto (apenas `services/geminiService.ts` em TS)
- CSS modularizado em pastas de estilos e componentes

## Estrutura Principal
- `src/`
  - `App.jsx` - componente principal da aplicação
  - `main.jsx` - entrada do React
  - `index.css` - estilos globais
  - `routes/Router.jsx` - rotas da aplicação
  - `pages/` - páginas principais da interface
    - `Cadastro.jsx`, `Cadastro_inical.jsx`, `Entrar.jsx`, `Inicio.jsx`, `Sobre.jsx`
    - `chat/` - componentes do chat
  - `components/` - componentes reutilizáveis como `Navbar.jsx`
  - `api/` - funções de API e serviços
  - `services/geminiService.ts` - serviço específico em TypeScript

## Dependências e Configuração
O projeto usa `package.json` e `vite.config.js`.
- Comando para instalar: `npm install`
- Comando para executar: `npm run dev`

## Como Ler Este Arquivo
Claude deve usar esta página como referência de alto nível e de estrutura, focando nos arquivos listados e nas tecnologias mencionadas.

## Observações Importantes
- O repositório fica em `yeezus/yeezus` dentro do workspace.
- Algumas páginas usam estilos específicos em `src/styles/` e `src/components/`.
- A implementação principal é em React com roteamento e formulários de cadastro/login.

## Nota para Claude
Use este arquivo para entender rapidamente o contexto do projeto antes de responder ou modificar arquivos. Priorize a navegação do código, a arquitetura dos componentes e as dependências listadas acima.