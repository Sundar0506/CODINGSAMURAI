import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import './Chat.css';  // Import the CSS file

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle sign-out functionality
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out successfully");
      })
      .catch((error) => {
        console.error("Error signing out: ", error);
      });
  };

  // Send message to Firestore
  const sendMessage = async (e) => {
    e.preventDefault();

    if (message.trim()) {
      try {
        // Add user message to Firestore
        const newMessage = await addDoc(collection(db, 'messages'), {
          text: message,
          user: auth.currentUser.email,
          avatar: auth.currentUser.photoURL || 'https://th.bing.com/th/id/OIP.AlIScK6urTegkZ178dAAGgHaHa?rs=1&pid=ImgDetMain',  // Default avatar if none
          timestamp: new Date(),
        });

        // Optimistically add message to the UI
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: newMessage.id,
            text: message,
            user: auth.currentUser.email,
            avatar: auth.currentUser.photoURL || 'https://th.bing.com/th/id/OIP.AlIScK6urTegkZ178dAAGgHaHa?rs=1&pid=ImgDetMain',
            timestamp: new Date(),
          },
        ]);

        // Clear input field
        setMessage('');

        // Simulate chatbot response
        setTimeout(() => {
          // Add chatbot message to Firestore
          addDoc(collection(db, 'messages'), {
            text: "I'm here to help! How can I assist you today?",
            user: 'Chatbot',
            avatar: 'https://th.bing.com/th/id/OIP.AlIScK6urTegkZ178dAAGgHaHa?rs=1&pid=ImgDetMain',  // Default avatar for chatbot
            timestamp: new Date(),
          });
        }, 1000);  // Simulate a delay of 1 second for the bot's reply
      } catch (error) {
        console.error("Error adding message: ", error);
      }
    }
  };

  // Delete message from Firestore
  const deleteMessage = async (id) => {
    try {
      const messageDoc = doc(db, 'messages', id);
      await deleteDoc(messageDoc);
      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  // Delete entire chat (all messages)
  const deleteEntireChat = async () => {
    if (window.confirm("Are you sure you want to delete all messages? This action cannot be undone.")) {
      try {
        const messagesSnapshot = await getDocs(collection(db, 'messages'));
        messagesSnapshot.forEach(async (messageDoc) => {
          await deleteDoc(doc(db, 'messages', messageDoc.id));
        });
        console.log("All messages deleted successfully");
      } catch (error) {
        console.error("Error deleting messages: ", error);
      }
    }
  };

  // Fetch messages in real-time
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesArray = [];
      querySnapshot.forEach((doc) => {
        messagesArray.push({ ...doc.data(), id: doc.id });  // Add document ID to message data
      });
      setMessages(messagesArray);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  return (
    <div className="chat-container">
      <h2>Chat Room</h2>
      <button onClick={handleSignOut}>Sign Out</button>

      {/* Delete entire chat button */}
      <button onClick={deleteEntireChat} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>
        Delete Entire Chat
      </button>

      {loading ? (
  <div className="spinner"></div> // Add this to show a loading spinner when messages are being fetched
) : (
  <div className="message-container">
    {messages.map((msg) => (
      <div
        key={msg.id}
        className={`message ${msg.user === auth.currentUser.email ? 'user-message' : 'other-message'}`}
      >
        <img
          src={msg.avatar || 'https://th.bing.com/th/id/OIP.AlIScK6urTegkZ178dAAGgHaHa?rs=1&pid=ImgDetMain'}
          alt="user-avatar"
          style={{ width: '40px', height: '40px' }}
        />
        <div>
          <div className="user">{msg.user}</div>
          <div className="text">{msg.text}</div>
        </div>
      </div>
    ))}
  </div>
)}


      <form onSubmit={sendMessage}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default Chat;
