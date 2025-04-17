import React, { useState, useRef, useEffect } from 'react';
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
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!userMessage.trim() && !selectedImage && !selectedFile) return;

    const now = new Date().toLocaleTimeString();
    let newHistory = [...chatHistory];

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
    } catch (error) {
      console.error('Chatbot error:', error);
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
    <div className="wrapper">
      <div className="chatbot-page">
        <h1 className="chatbot-title">SDG Finance ChatBot</h1>
        <div className="chatbot-section">
          <div className="chat-history" ref={chatHistoryRef}>
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                {msg.text && <p>{msg.text}</p>}
                {msg.image && <img src={msg.image} alt="upload" />}
                {msg.file && <p className="file-name">📄 {msg.file}</p>}
                <span className={`timestamp ${msg.sender}`}>{msg.timestamp}</span>
              </div>
            ))}
            {isTyping && <div className="chat-message bot"><p>Typing...</p></div>}
          </div>

          <div className="chat-input-container">
            <label className="upload-button">
              📄
              <input type="file" onChange={handleFileUpload} hidden />
            </label>
            <label className="upload-button">
              📷
              <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
            </label>
            <input
              type="text"
              className="chat-input"
              placeholder="Type your question..."
              value={userMessage}
              onChange={e => setUserMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            />
            <button className="send-button" onClick={handleSendMessage}>Send</button>
          </div>

          <button className="reset-button" onClick={handleReset}>Reset Chat</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
