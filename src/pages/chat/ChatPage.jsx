import React, { useState, useRef, useEffect } from 'react';
import { Send, Wallet, TrendingUp, RefreshCcw, BarChart3, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Message from './Mesage';
import Bear from './Bear';
import { getGeminiResponse } from '../../services/geminiService';
import acompanhamentoService from "../../api/acompanhamentoService";
import './chat.css';
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";

const QUICK_PROMPTS = [
  { label: 'Analise meus gastos deste mês', icon: <BarChart3 size={12} /> },
  { label: 'Onde posso investir o que sobrou?', icon: <TrendingUp size={12} /> },
  { label: 'Dicas para economizar mais', icon: <Wallet size={12} /> },
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Olá! Eu sou o YeBOT. Já estou conectado aos seus dados financeiros. Como posso te ajudar a multiplicar seu patrimônio hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextoFinanceiro, setContextoFinanceiro] = useState(''); // Novo estado para guardar os dados
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Busca os dados do banco assim que o chat abre
  useEffect(() => {
    async function carregarDadosDoBanco() {
      try {
        const userId = Number(localStorage.getItem("userId"));
        if (!userId) return;

        // Puxa as informações através do seu acompanhamentoService
        const [resReceitas, resDespesas, resInvest] = await Promise.all([
          acompanhamentoService.getReceitas(userId),
          acompanhamentoService.getDespesas(userId),
          acompanhamentoService.getInvestimentos(userId)
        ]);

        const totalReceitas = resReceitas.data.reduce((acc, curr) => acc + curr.valor, 0);
        const totalDespesas = resDespesas.data.reduce((acc, curr) => acc + curr.valor, 0);
        const totalInvestimentos = resInvest.data.reduce((acc, curr) => acc + curr.valor, 0);
        const sobra = totalReceitas - totalDespesas - totalInvestimentos;

        // Cria um prompt de sistema invisível com a realidade do usuário
        const dadosContexto = `
          [INFORMAÇÃO DE SISTEMA - DADOS REAIS DO USUÁRIO]
          - Renda Total: R$ ${totalReceitas.toFixed(2)}
          - Despesas Totais: R$ ${totalDespesas.toFixed(2)}
          - Total já Investido: R$ ${totalInvestimentos.toFixed(2)}
          - Dinheiro Livre (Sobra atual): R$ ${sobra.toFixed(2)}
          
          Diretriz para a IA: Você é o YeBOT. Use os dados acima para dar respostas ultra-personalizadas. Se o usuário perguntar como investir, sugira com base na "Sobra atual" e no "Total já Investido". Se as despesas estiverem muito altas comparadas à renda, dê um alerta. Responda com formatação Markdown limpa, tabelas se necessário, e tom direto.
        `;
        
        setContextoFinanceiro(dadosContexto);
      } catch (error) {
        console.error("Erro ao sincronizar dados com o YeBOT:", error);
      }
    }

    carregarDadosDoBanco();
  }, []);

  const handleSend = async (text) => {
    const messageToSend = text || input.trim();
    if (!messageToSend || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: messageToSend }]);
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      // Injeta o contexto financeiro invisível junto com a mensagem do usuário
      const promptEnriquecido = contextoFinanceiro 
        ? `${messageToSend}\n\n${contextoFinanceiro}` 
        : messageToSend;

      const response = await getGeminiResponse(promptEnriquecido, history);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Desculpe, não consegui processar sua solicitação.' }]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao conectar com o assistente.';
      setMessages(prev => [...prev, { role: 'model', text: `⚠️ **Erro:** ${errorMessage}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="yeezus-app">
      {/* Header */}
      <header className="yeezus-header">
        <div className="header-logo-container">
          <div className="bear-icon-wrapper">
            <Bear className="text-white" />
          </div>
          <div className="header-text">
            <h1>YeBOT</h1>
            <p>ASSISTENTE FINANCEIRO</p>
          </div>
        </div>

        <div className="logo">
        <Link to="/">
          <img src={Logo} alt="Yeezus Logo" />
        </Link>
        </div>
      </header>

      {/* Chat Container */}
      <main className="yeezus-main">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <Message key={idx} msg={msg} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="loading-row"
          >
            <div className="loading-content">
              <Loader2 size={12} className="animate-spin prompt-icon" />
              <span className="loading-text">Analisando seus dados e cruzando com o mercado...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="yeezus-footer">
        <div className="footer-content">
          {/* Quick Prompts Atualizados */}
          <div className="quick-prompts">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSend(prompt.label)}
                disabled={isLoading}
                className="prompt-btn"
              >
                <span className="prompt-icon">{prompt.icon}</span>
                {prompt.label}
              </button>
            ))}
          </div>

          <div className="input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="PERGUNTE O QUE QUISER SOBRE SUAS FINANÇAS..."
              className="yeezus-input"
            />
          </div>
          
          <div className="footer-bottom">
            <p className="disclaimer">
              YeBOT // THIS MUST BE HEAVEN
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}