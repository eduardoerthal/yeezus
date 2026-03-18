import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { User } from 'lucide-react';
import Bear from './Bear';
import './chat.css';

const Message = ({ msg }) => {
  const isUser = msg.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`msg-row ${isUser ? 'user' : 'model'}`}
    >
      <div className="msg-wrapper">
        <div className={`msg-avatar ${isUser ? 'user' : 'model'}`}>
          {isUser ? (
            <User className="w-4 h-4" style={{ color: '#a1a1aa' }} />
          ) : (
            <Bear className="w-4 h-4" />
          )}
        </div>
        <div className={`msg-bubble ${isUser ? 'user' : 'model'}`}>
          <div className="markdown-body">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p>{children}</p>,
                ul: ({ children }) => <ul>{children}</ul>,
                ol: ({ children }) => <ol>{children}</ol>,
                li: ({ children }) => <li>{children}</li>,
                h1: ({ children }) => <h1>{children}</h1>,
                h2: ({ children }) => <h2>{children}</h2>,
                h3: ({ children }) => <h3>{children}</h3>,
                table: ({ children }) => (
                  <div className="table-container">
                    <table>{children}</table>
                  </div>
                ),
                th: ({ children }) => <th>{children}</th>,
                td: ({ children }) => <td>{children}</td>,
                code: ({ children }) => <code>{children}</code>,
                strong: ({ children }) => <strong>{children}</strong>,
              }}
            >
              {msg.text}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Message;
