import React, { useState, useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';
import Dashboard from './Dashboard'; // <--- Import Dashboard
import './ChatInterface.css';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [dashboardData, setDashboardData] = useState(null); // <--- State for Dashboard
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(`sess_${Math.random()}`);
  const messagesEndRef = useRef(null);

  useEffect(() => { sendMessage("HELLO_INIT", true); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async (text, isInit = false) => {
    if (!text.trim() && !isInit) return;
    if (!isInit) setMessages(prev => [...prev, { text, sender: 'user', type: 'text' }]);

    setInput('');
    setLoading(true);

    try {
      const res = await fetch('https://autonomous-loan-officer-rbup.vercel.app/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text }),
      });
      const data = await res.json();

      setMessages(prev => [...prev, { 
        text: data.text, sender: 'bot', type: data.type, 
        options: data.options, pdfUrl: data.pdfUrl 
      }]);

      // UPDATE DASHBOARD if data is present
      if (data.dashboard) {
        setDashboardData(data.dashboard); 
      }

    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  return (
    <div className="main-layout">
      {/* LEFT SIDE: CHAT */}
      <div className="chat-section">
        <div className="chat-header">
          <div className="header-info">
           
            <div>
              <h3>AI-Bank</h3>
              <span className="status-text">Verified Business</span>
            </div>
          </div>
          {/* Persistent Main Menu Button */}
          <button className="menu-icon-btn" onClick={() => sendMessage("Main Menu")}>
            ☰ Main Menu
          </button>
        </div>

        <div className="chat-window">
          {messages.map((msg, i) => (
            <ChatMessage key={i} msg={msg} onOptionClick={sendMessage} />
          ))}
          {loading && <div className="loading-indicator">Typing...</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
         
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Type a message..."
          />
          <button className="send-btn" onClick={() => sendMessage(input)}>➤</button>
        </div>
      </div>

      {/* RIGHT SIDE: DASHBOARD */}
      
    </div>
  );
};

export default ChatInterface;