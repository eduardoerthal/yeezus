import React, { useState, useRef, useEffect } from 'react';
import { Send, Wallet, TrendingUp, RefreshCcw, BarChart3, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Message from './Mesage';
import Bear from './Bear';
import { getGeminiResponse } from '../../services/geminiService';
import './chat.css';
import Logo from "../../assets/logo.svg";
import { Link } from "react-router-dom";


const QUICK_PROMPTS = [
  { label: 'O que é Bitcoin?', icon: <Wallet size={12} /> },
  { label: 'Como está a SELIC?', icon: <TrendingUp size={12} /> },
  { label: 'Dólar hoje', icon: <RefreshCcw size={12} /> },
];

export default function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: 'Olá! Eu sou o YeBOT. Como posso ajudar com suas dúvidas sobre o mercado hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      const response = await getGeminiResponse(messageToSend, history);
      setMessages(prev => [...prev, { role: 'model', text: response || 'Desculpe, não consegui processar sua solicitação.' }]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao conectar com o assistente.';
      setMessages(prev => [...prev, { role: 'model', text: `⚠️ **Erro:** ${errorMessage}\n\nVerifique se você adicionou a chave \`VITE_API_CHAVE\` corretamente no menu **Settings -> Secrets**.` }]);
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
              <span className="loading-text">Scanning Market Data...</span>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <footer className="yeezus-footer">
        <div className="footer-content">
          {/* Quick Prompts */}
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
              placeholder="PERGUNTE O QUE QUISER RELACIONADO A FINANÇAS..."
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
