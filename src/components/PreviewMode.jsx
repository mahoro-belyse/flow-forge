import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

export default function PreviewMode({ nodes, onClose }) {
  const startNode = nodes.find(n => n.type === 'start') || nodes[0];
  const [history, setHistory] = useState([{ node: startNode, answer: null }]);
  const [typing, setTyping] = useState(false);
  const msgRef = useRef(null);
  const current = history[history.length - 1].node;
  const isEnd = current.type === 'end' || current.options.length === 0;

  const pick = opt => {
    const next = nodes.find(n => n.id === opt.nextId);
    if (!next) return;
    setHistory(h => [...h, { node: h[h.length-1].node, answer: opt.label }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setHistory(h => [...h, { node: next, answer: null }]);
    }, 900);
  };

  useEffect(() => {
    if (msgRef.current) msgRef.current.scrollTop = msgRef.current.scrollHeight;
  }, [history, typing]);

  const restart = () => setHistory([{ node: startNode, answer: null }]);

  return (
    <div className="preview-overlay fade-in" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="preview-chat slide-up">
        <div className="preview-header">
          <div className="bot-avatar">🤖</div>
          <div className="preview-header-info">
            <div className="preview-header-name">FlowForge Bot</div>
            <div className="preview-header-status"><span className="status-dot" /> Online — Ready to help</div>
          </div>
          <button className="icon-btn" style={{ color: 'rgba(255,255,255,0.7)' }} onClick={onClose}><Icon name="close" size={18} /></button>
        </div>
        <div className="preview-messages" ref={msgRef}>
          {history.map((h, i) => (
            <React.Fragment key={i}>
              {h.answer && (
                <div className="msg-user fade-in">
                  <div className="msg-bubble">{h.answer}</div>
                </div>
              )}
              {h.answer === null && (
                <div className="msg-bot fade-in">
                  <div className="msg-avatar"><Icon name="bot" size={14} /></div>
                  <div className="msg-bubble">{h.node.question}</div>
                </div>
              )}
            </React.Fragment>
          ))}
          {typing && (
            <div className="msg-bot fade-in">
              <div className="msg-avatar"><Icon name="bot" size={14} /></div>
              <div className="msg-bubble"><div className="typing-indicator"><div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" /></div></div>
            </div>
          )}
          {isEnd && !typing && (
            <div className="preview-end slide-up">
              <div className="preview-end-icon">🎉</div>
              <div className="preview-end-text">Conversation ended</div>
              <button className="btn btn-primary" onClick={restart}><Icon name="restart" size={13} /> Restart</button>
            </div>
          )}
        </div>
        {!isEnd && !typing && (
          <div className="preview-options">
            {current.options.map((o, i) => (
              <button key={i} className="preview-option-btn" onClick={() => pick(o)}>
                <span style={{ fontSize: 16 }}>{['1️⃣','2️⃣','3️⃣','4️⃣','5️⃣'][i] || '•'}</span>
                {o.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}