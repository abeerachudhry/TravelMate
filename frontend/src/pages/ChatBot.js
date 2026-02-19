import React, { useState } from 'react';

function ChatBot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: '👋 Welcome to TravelMate! Ask me about 🚌 buses, 🏨 hotels, or 🎁 special offers.' }
  ]);
  const [input, setInput] = useState('');
  const [show, setShow] = useState(false);

  const responses = {
    hotels: [
      { keywords: ['serena'], answer: '🏨 Serena Hotel Islamabad costs PKR 20,000 per night.' },
      { keywords: ['pc', 'pearl'], answer: '🏨 Pearl Continental Lahore costs PKR 18,000 per night.' },
      { keywords: ['ramada'], answer: '🏨 Ramada Multan costs PKR 12,000 per night.' },
    ],
    buses: [
      { keywords: ['karachi to lahore'], answer: '🚌 GreenLine Intercity: Karachi → Lahore at 09:00 PM (PKR 4,200).' },
      { keywords: ['lahore to islamabad'], answer: '🚌 SkyLux Executive: Lahore → Islamabad at 07:30 AM (PKR 1,800).' },
      { keywords: ['peshawar to multan'], answer: '🚌 Safe Travels: Peshawar → Multan at 09:00 AM (PKR 2,800).' },
      { keywords: ['lahore to multan'], answer: '🚌 RoadRunner Coach: Lahore → Multan at 11:00 AM (PKR 1,200).' },
      { keywords: ['quetta to karachi'], answer: '🚌 Eagle Tours: Quetta → Karachi at 04:00 PM (PKR 6,000).' },
    ],
    offers: [
      { keywords: ['summer'], answer: '☀️ Summer Bus Bonanza: 20% off Lahore → Islamabad till Aug 31.' },
      { keywords: ['group'], answer: '👥 Group Offer: 10% off for 5+ people on any bus route.' },
      { keywords: ['serena deal'], answer: '🎁 Serena Hotel: Book 3 nights, get 4th free (till July 15).' },
    ]
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userText = input.toLowerCase();
    let reply = "🤔 Sorry, I couldn't understand. Try asking about buses, hotels, or offers.";

    for (const group of Object.values(responses)) {
      for (const item of group) {
        if (item.keywords.some(k => userText.includes(k))) {
          reply = item.answer;
          break;
        }
      }
      if (!reply.includes("couldn't")) break;
    }

    setMessages([...messages, { sender: 'user', text: input }, { sender: 'bot', text: reply }]);
    setInput('');
  };

  const styles = {
    chatIcon: {
      position: 'fixed',
      bottom: '25px',
      right: '25px',
      background: '#ff5722',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      fontSize: '26px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      zIndex: 9999,
      transition: 'transform 0.2s ease-in-out',
    },
    chatBox: {
      position: 'fixed',
      bottom: '100px',
      right: '25px',
      width: '350px',
      maxHeight: '500px',
      backdropFilter: 'blur(12px)',
      backgroundColor: 'rgba(30, 30, 30, 0.6)',
      color: '#fff',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      opacity: show ? 1 : 0,
      transform: show ? 'scale(1)' : 'scale(0.8)',
      transition: 'all 0.3s ease',
      zIndex: 9999,
    },
    chatIcon: {
  position: 'fixed',
  bottom: '25px',
  right: '25px',
  background: '#ff5722',
  color: '#fff',
  border: 'none',
  borderRadius: '50%',
  width: '60px',
  height: '60px',
  fontSize: '26px',
  cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  zIndex: 9999,
  transition: 'transform 0.2s ease-in-out',
  transform: show ? 'scale(1.1)' : 'scale(1)',
},

    header: {
      background: '#111',
      padding: '12px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '16px',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
    },
    messages: {
      flex: 1,
      padding: '10px',
      overflowY: 'auto',
      fontSize: '14px',
    },
    message: (sender) => ({
      marginBottom: '10px',
      textAlign: sender === 'user' ? 'right' : 'left',
      color: sender === 'user' ? '#ff9800' : '#fff',
    }),
    inputBox: {
      display: 'flex',
      borderTop: '1px solid rgba(255,255,255,0.1)',
    },
    input: {
      flex: 1,
      padding: '10px',
      border: 'none',
      outline: 'none',
      backgroundColor: 'transparent',
      color: '#fff',
    },
    sendButton: {
      backgroundColor: '#ff5722',
      color: 'white',
      border: 'none',
      padding: '10px 15px',
      cursor: 'pointer',
    },
  };

  return (
    <>
      {show && (
        <div style={styles.chatBox}>
          <div style={styles.header}>🧳 TravelMate Assistant</div>
          <div style={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={styles.message(msg.sender)}>{msg.text}</div>
            ))}
          </div>
          <div style={styles.inputBox}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button style={styles.sendButton} onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
      <button style={styles.chatIcon} onClick={() => setShow(!show)}>💬</button>
    </>
  );
}

export default ChatBot;



