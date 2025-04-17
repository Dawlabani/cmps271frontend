import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import './Chatbot.css';

function ChatBot() {
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      sender: 'bot',
      text: 'Welcome to the SDG Finance ChatBot! Ask me anything about sustainable finance, eco-friendly products, or socially responsible investing. For example: "How can I invest sustainably?"',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() && !selectedImage && !selectedFile) return;

    const newHistory = [...chatHistory];
    const now = new Date().toLocaleTimeString();

    if (selectedImage) {
      newHistory.push({ sender: 'user', image: URL.createObjectURL(selectedImage), timestamp: now });
    }
    if (selectedFile) {
      newHistory.push({ sender: 'user', file: selectedFile.name, timestamp: now });
    }
    if (userMessage.trim()) {
      newHistory.push({ sender: 'user', text: userMessage.trim(), timestamp: now });
    }

    setChatHistory(newHistory);
    setUserMessage('');
    setSelectedImage(null);
    setSelectedFile(null);
    setIsTyping(true);

    try {
      const formData = new FormData();
      if (selectedImage) formData.append('image', selectedImage);
      if (selectedFile) formData.append('file', selectedFile);
      formData.append('message', userMessage.trim() || 'File upload');

      const response = await api.post('/api/chatbot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const reply = response.data.reply;
      setChatHistory(prev => [
        ...newHistory,
        { sender: 'bot', text: reply, timestamp: new Date().toLocaleTimeString() }
      ]);

    } catch (err) {
      console.error('Chatbot error:', err);
      setChatHistory(prev => [
        ...newHistory,
        { sender: 'bot', text: 'Sorry, something went wrong.', timestamp: new Date().toLocaleTimeString() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) setSelectedImage(file);
    e.target.value = '';
  };

  const handleFileUpload = e => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
    e.target.value = '';
  };

  const handleReset = () => {
    setChatHistory([
      {
        sender: 'bot',
        text: 'Welcome to the SDG Finance ChatBot! Ask me anything about sustainable finance, eco-friendly products, or socially responsible investing. For example: "How can I invest sustainably?"',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  return (
    <div className="chatbot-wrapper">
      <motion.div
        className="chatbot-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="chatbot-header">SDG Finance ChatBot</h2>
        <div className="chatbot-history">
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`message ${msg.sender}`}> 
              {msg.text && <p>{msg.text}</p>}
              {msg.image && <img src={msg.image} alt="upload" className="upload-preview" />}
              {msg.file && <p className="file-name">📄 {msg.file}</p>}
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          ))}
          {isTyping && <div className="message bot"><p>Typing...</p></div>}
          <div ref={chatEndRef} />
        </div>

        <div className="chatbot-inputs">
          <label className="upload-btn">
            📄
            <input type="file" onChange={handleFileUpload} hidden />
          </label>
          <label className="upload-btn">
            📷
            <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
          </label>
          <input
            type="text"
            value={userMessage}
            onChange={e => setUserMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your question..."
            className="chat-input"
          />
          <button onClick={handleSendMessage} className="send-btn">Send</button>
          <button onClick={handleReset} className="reset-btn">Reset</button>
        </div>
      </motion.div>
    </div>
  );
}

export default ChatBot;
