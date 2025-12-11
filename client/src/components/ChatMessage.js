import React from 'react';
import './ChatInterface.css';

const ChatMessage = ({ msg, onOptionClick }) => {
  const isBot = msg.sender === 'bot';

  // Helper: Converts **text** to <strong>text</strong> and \n to <br/>
  const formatText = (text) => {
    if (!text) return "";
    let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
    formatted = formatted.replace(/\n/g, '<br />'); // Line breaks
    return formatted;
  };

  return (
    <div className={`message-row ${msg.sender}`}>
      
      {/* Bot Avatar */}
      {isBot && <div className="ai-avatar" style={{fontSize: '20px', marginRight: '8px'}}>✨</div>}
      
      <div className={`message-bubble ${msg.sender}`}>
        
        {/* 1. Main Text Content (Render HTML safely) */}
        <div 
          className="message-text" 
          dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} 
        />

        {/* 2. Options Buttons (If type is 'options') */}
        {msg.type === 'options' && msg.options && (
          <div className="options-container">
            {msg.options.map((option, idx) => (
              <button
                key={idx}
                className="option-btn"
                onClick={() => onOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* 3. PDF Download Link (If type is 'pdf') */}
        {msg.type === 'pdf' && msg.pdfUrl && (
          <div className="pdf-container" style={{ marginTop: '10px' }}>
            <a 
              href={msg.pdfUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              download="SanctionLetter.pdf"  // <--- THIS IS THE FIX
              className="pdf-link"
            >
              📥 Download Sanction Letter
            </a>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChatMessage;