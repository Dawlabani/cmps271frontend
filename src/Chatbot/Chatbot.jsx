import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
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
  const [selectedImage, setSelectedImage] = useState(null); // Store image file object
  const [selectedFile, setSelectedFile] = useState(null); // Store file object directly
  const chatHistoryRef = useRef(null);

  useEffect(() => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSendMessage = async () => {
    // If no text and no file/image, don't send.
    if (!userMessage.trim() && !selectedImage && !selectedFile) return;

    const newHistory = [...chatHistory];

    if (selectedImage) {
      // For display purposes, generate a temporary URL
      newHistory.push({
        sender: 'user',
        image: URL.createObjectURL(selectedImage),
        timestamp: new Date().toLocaleTimeString()
      });
    }
    if (selectedFile) {
      newHistory.push({
        sender: 'user',
        file: selectedFile.name,
        timestamp: new Date().toLocaleTimeString()
      });
    }
    // Use default text if none is provided but file(s) exist.
    const messageToSend =
      userMessage.trim() || (selectedImage || selectedFile ? "File upload" : "");

    if (messageToSend) {
      newHistory.push({
        sender: 'user',
        text: messageToSend,
        timestamp: new Date().toLocaleTimeString()
      });
    }

    setChatHistory(newHistory);
    setUserMessage('');
    setSelectedImage(null);
    setSelectedFile(null);
    setIsTyping(true);

    try {
      const formData = new FormData();
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      if (selectedFile) {
        formData.append('file', selectedFile);
      }
      formData.append('message', messageToSend);

      const response = await axios.post('/api/chatbot', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const reply = response.data.reply;
      setChatHistory([
        ...newHistory,
        { sender: 'bot', text: reply, timestamp: new Date().toLocaleTimeString() }
      ]);
    } catch (error) {
      console.error('Error fetching chatbot response:', error);
      setChatHistory([
        ...newHistory,
        {
          sender: 'bot',
          text: 'Sorry, something went wrong.',
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedImage(file); // Store the file object directly
    e.target.value = ''; // Reset input value
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file); // Store the file object directly
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleResetChat = () => {
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
      <motion.div
        className="chatbot-page"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <h1 className="chatbot-title">SDG Finance ChatBot</h1>
        <div className="chatbot-section">
          <div className="chat-history" ref={chatHistoryRef}>
            {chatHistory.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.sender}`}>
                {msg.text && <p>{msg.text}</p>}
                {msg.image && (
                  <img
                    src={msg.image}
                    alt="User Upload"
                    style={{
                      maxWidth: '200px',
                      borderRadius: '12px',
                      marginTop: '0.5rem',
                      boxShadow: 'var(--shadow)'
                    }}
                  />
                )}
                {msg.file && (
                  <p
                    style={{
                      background: 'var(--light)',
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      boxShadow: 'var(--shadow)',
                      marginTop: '0.5rem',
                      color: 'var(--primary)'
                    }}
                  >
                    {msg.file}
                  </p>
                )}
                <span className={`timestamp ${msg.sender}`}>{msg.timestamp}</span>
              </div>
            ))}
            {isTyping && (
              <div className="chat-message bot">
                <p>Typing...</p>
              </div>
            )}
          </div>
          <div className="chat-input-container">
            <label className="upload-button" style={{ cursor: 'pointer', padding: '0.5rem 0.75rem', fontSize: '1.5rem', marginTop: '0.5rem' }}>
              📄
              <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>
            <label className="upload-button" style={{ cursor: 'pointer', padding: '0.5rem 0.75rem', fontSize: '1.5rem', marginTop: '0.5rem' }}>
              📷
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
            </label>
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me anything..."
              className="chat-input"
            />
            <button onClick={handleSendMessage} className="send-button">
              Send
            </button>
          </div>
          <button onClick={handleResetChat} className="reset-button">
            Reset Chat
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ChatBot;
