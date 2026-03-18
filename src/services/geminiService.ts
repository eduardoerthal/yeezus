import { GoogleGenAI } from "@google/genai";

// Direct retrieval from injected variables
const getApiKey = () => {
  const key = import.meta.env.VITE_API_CHAVE || process.env.VITE_API_CHAVE || process.env.GEMINI_API_KEY;
  return (key && key !== "undefined" && key !== "null") ? key : null;
};

export const getGeminiResponse = async (message: string, history: { role: "user" | "model"; parts: { text: string }[] }[]) => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error("API Key não encontrada. Verifique se 'VITE_API_CHAVE' está nos Secrets e RECARREGUE a página.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `Você é o YeBOT, um assistente financeiro especialista e altamente qualificado. 
      Suas especialidades incluem:
      1. Criptomoedas: Entende profundamente de Bitcoin, Ethereum, DeFi, e tendências de mercado cripto.
      2. Volatilidade do Mercado: Analisa riscos, indicadores técnicos e sentimentos de mercado.
      3. Câmbio: Conhece flutuações de moedas (Dólar, Euro, Real) e fatores macroeconômicos.
      4. Investimentos Tradicionais: Domina Renda Fixa (CDB, Tesouro Direto), Renda Variável (Ações, FIIs) e Previdência.

      Seu tom deve ser profissional, educativo e cauteloso.
      Perguntas sobre moedas, você deve pesquisar e responder de maneira curta quanto a moeda ta valendo na compra e na venda;
      As respostas devem ser curtas e bem definidas, não podem ser leigas e nem dúbias, não utilizar tabelas mas pode utilizar listas.
      Lembre-se, você é o especilista, deve guiar o usuário.
      Caso o usuário pergunte algo que não seja relacionado a finanças você deve responder "Sou um assistente financeiro, eu não posso te ajudar com isso"
      Responda sempre em Português do Brasil.`,
    },
    history: history,
  });

  const result = await chat.sendMessage({ message });
  return result.text;
};
