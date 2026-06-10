# Yeezus - Assistente Financeiro Inteligente

Yeezus é uma plataforma de gerenciamento financeiro pessoal desenvolvida para simplificar o controle de gastos, monitoramento de investimentos e organização de metas através de inteligência artificial.

## 👥 Integrantes do Projeto
* **Leonardo** - Desenvolvedor Backend & Frontend

## 🚀 Funcionalidades Principais
* **Acompanhamento Financeiro:** Registro e controle completo de Receitas, Despesas e Investimentos com filtragem por período (Mensal, Trimestral e Anual).
* **Planejamento 50/30/20:** Divisão automática e visual da renda mensal em Necessidades (50%), Desejos (30%) e Poupança (20%) integrada aos dados do banco.
* **Relatórios e Análises:** Gráficos interativos de Receita vs. Despesa, agrupamento por categorias e histórico das últimas transações.
* **YeBOT:** Chatbot assistente integrado à API do Gemini, capaz de ler os dados financeiros reais da persona para fornecer diagnósticos e recomendações de investimentos sob medida.
* **Simulador de Investimentos:** Fluxo guiado em etapas (Objetivo, Perfil e Resultado) que utiliza IA para traçar estratégias personalizadas de alocação de ativos.

## 🛠️ Tecnologias Utilizadas
* **Frontend:** React, Vite, Framer Motion, Recharts, Material UI (MUI), Lucide React.
* **Banco de Dados:** PostgreSQL / SQLite.
* **IA:** Google Gemini API (via Google Gen AI SDK).

## 🔧 Como Executar o Projeto

### Frontend
1. Navegue até a pasta do frontend: `cd yeezus`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` na raiz do frontend e adicione a sua chave da API: `VITE_API_CHAVE=sua_chave_aqui`
4. Inicie o servidor de desenvolvimento: `npm run dev`

### Backend
1. Navegue até a pasta correspondente ao servidor Python.
2. Ative o ambiente virtual e instale as dependências listadas no `requirements.txt`.
3. Execute a API com o Uvicorn: `uvicorn main:app --reload --port 8080`
