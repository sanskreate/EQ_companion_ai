// Main React App entry point
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Signup from '../pages/Signup';
import Login from '../pages/Login';
import Chat from '../pages/Chat';
import './App.css';

const defaultPersonas = [
  {
    name: 'Aarav',
    file: 'persona-configs/aarav.json',
    avatar: '🧑🏽',
    desc: 'Witty, Supportive, Ambitious',
  },
  {
    name: 'Rhea',
    file: 'persona-configs/rhea.json',
    avatar: '👩🏻',
    desc: 'Empathetic, Creative, Calm',
  },
  {
    name: 'Leo',
    file: 'persona-configs/leo.json',
    avatar: '🧑🏼',
    desc: 'Adventurous, Bold, Loyal',
  },
];

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const handleLogin = () => setIsAuthenticated(true);
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };
  const [personas, setPersonas] = useState(defaultPersonas);
  const [userInput, setUserInput] = useState('');
  // Store chat history for each persona by name
  const [personaChats, setPersonaChats] = useState(() => {
    const obj = {};
    defaultPersonas.forEach(p => { obj[p.name] = []; });
    return obj;
  });
  const [messages, setMessages] = useState([]);
  const [persona, setPersona] = useState(defaultPersonas[0]);
  const [theme, setTheme] = useState('light');
  const [showProfile, setShowProfile] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Guest',
    age: '',
    email: '',
    preferences: '',
    personality: '',
  });
  const [editProfile, setEditProfile] = useState(false);
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [newPersona, setNewPersona] = useState({
    name: '',
    type: '',
    traits: '',
    tone: '',
    attachment_style: '',
    love_language: '',
  });
  const [personaError, setPersonaError] = useState('');

  const handleSend = async () => {
    if (!userInput.trim()) return;
    const newUserMsg = { from: 'user', text: userInput };
    setMessages((msgs) => {
      const updated = [...msgs, newUserMsg];
      setPersonaChats(prev => ({ ...prev, [persona.name]: updated }));
      return updated;
    });
    setUserInput('');
    const res = await fetch(
      `http://localhost:8000/chat?user_input=${encodeURIComponent(userInput)}&persona=${persona.file}`
    );
    const data = await res.json();
    setMessages((msgs) => {
      const updated = [...msgs, { from: 'bot', text: data.persona_reply }];
      setPersonaChats(prev => ({ ...prev, [persona.name]: updated }));
      return updated;
    });
  };

  const handleThemeToggle = () => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light');
  };

  // Restore chat for persona when switching
  const handlePersonaChange = (p) => {
    setPersona(p);
    setMessages(personaChats[p.name] || []);
  };

  // Handle custom persona creation
  // Random avatar generator (emoji pool)
  const randomAvatar = () => {
    const emojis = ['🧑🏻', '🧑🏼', '🧑🏽', '🧑🏾', '🧑🏿', '👩🏻', '👩🏼', '👩🏽', '👩🏾', '👩🏿', '👨🏻', '👨🏼', '👨🏽', '👨🏾', '👨🏿', '🧔', '👱', '🧑‍🎤', '🧑‍💻', '🧑‍🚀', '🧑‍🔬', '🧑‍🏫', '🧑‍🍳', '🧑‍🎨', '🧑‍🚒', '🧑‍✈️', '🧑‍⚕️', '🧑‍🌾', '🧑‍🔧', '🧑‍🏭', '🧑‍💼', '🧑‍🔬'];
    return emojis[Math.floor(Math.random() * emojis.length)];
  };

  const handleCreatePersona = async (e) => {
    e.preventDefault();
    setPersonaError('');
    if (!newPersona.name || !newPersona.type || !newPersona.traits || !newPersona.tone || !newPersona.attachment_style || !newPersona.love_language) {
      setPersonaError('All fields are required.');
      return;
    }
    // Prepare persona object for backend
    const personaObj = {
      name: newPersona.name,
      type: newPersona.type,
      traits: newPersona.traits.split(',').map(t => t.trim()).filter(Boolean),
      tone: newPersona.tone,
      attachment_style: newPersona.attachment_style,
      love_language: newPersona.love_language,
    };
    try {
      const res = await fetch('http://localhost:8000/create_persona/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personaObj),
      });
      if (!res.ok) {
        const err = await res.json();
        setPersonaError(err.detail || 'Failed to create persona.');
        return;
      }
      // Add to local personas list
      const personaFile = `persona-configs/${newPersona.name.toLowerCase()}.json`;
      const newP = { ...personaObj, file: personaFile, avatar: randomAvatar(), desc: (personaObj.traits || []).join(', ') };
      setPersonas(ps => [...ps, newP]);
      setPersona(newP);
      setMessages([]);
      setShowPersonaModal(false);
      setNewPersona({ name: '', type: '', traits: '', tone: '', attachment_style: '', love_language: '' });
    } catch (err) {
      setPersonaError('Failed to create persona.');
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup onSignup={() => window.location.href = '/login'} theme={theme} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} theme={theme} />} />
        <Route
          path="/"
          element={<Chat isAuthenticated={isAuthenticated} onRequireAuth={() => window.location.href = '/login'} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
