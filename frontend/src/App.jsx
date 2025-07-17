// Main React App entry point
import React, { useState } from 'react';
import './App.css';

const personas = [
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
  const [userInput, setUserInput] = useState('');
  // Store chat history for each persona by name
  const [personaChats, setPersonaChats] = useState(() => {
    const obj = {};
    personas.forEach(p => { obj[p.name] = []; });
    return obj;
  });
  const [messages, setMessages] = useState([]);
  const [persona, setPersona] = useState(personas[0]);
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

  return (
    <div className={`app-container ${theme}`}>
      <header className="header">
        <div className="persona-switcher" style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
          <select
            className="persona-dropdown"
            value={persona.name}
            onChange={e => {
              const p = personas.find(p => p.name === e.target.value);
              if (p) handlePersonaChange(p);
            }}
            style={{fontSize: '1.1rem', borderRadius: '10px', padding: '0.5em 1.2em', border: '1.5px solid var(--border)', background: 'var(--button-bg)', color: 'var(--button-fg)', fontWeight: 500}}
          >
            {personas.map(p => (
              <option key={p.name} value={p.name}>{p.avatar} {p.name}</option>
            ))}
          </select>
          <div className="persona-brief" style={{fontSize: '1.1rem', color: 'var(--muted)'}}>
            <span style={{fontWeight: 600, color: 'var(--accent)', marginRight: 6}}>{persona.avatar} {persona.name}:</span>
            <span>{persona.desc}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="theme-toggle" onClick={handleThemeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="profile-btn" onClick={() => setShowProfile((v) => !v)}>
            👤
          </button>
        </div>
      </header>

      {showProfile && (
        <div className="profile-modal">
          <div className="profile-content">
            <h3>User Profile</h3>
            {editProfile ? (
              <>
                <label>Name</label>
                <input value={profile.name} onChange={e => setProfile(p => ({...p, name: e.target.value}))} />
                <label>Age</label>
                <input type="number" value={profile.age} onChange={e => setProfile(p => ({...p, age: e.target.value}))} />
                <label>Email</label>
                <input type="email" value={profile.email} onChange={e => setProfile(p => ({...p, email: e.target.value}))} />
                <label>Preferences</label>
                <input value={profile.preferences} onChange={e => setProfile(p => ({...p, preferences: e.target.value}))} />
                <label>Personality Type</label>
                <select value={profile.personality} onChange={e => setProfile(p => ({...p, personality: e.target.value}))}>
                  <option value="">Select...</option>
                  <option value="INTJ">INTJ</option>
                  <option value="INFP">INFP</option>
                  <option value="ENFP">ENFP</option>
                  <option value="ENTP">ENTP</option>
                  <option value="ISFJ">ISFJ</option>
                  <option value="ESFJ">ESFJ</option>
                  <option value="ISTJ">ISTJ</option>
                  <option value="ESTJ">ESTJ</option>
                  <option value="Other">Other</option>
                </select>
                <button onClick={() => setEditProfile(false)}>Save</button>
              </>
            ) : (
              <>
                <p><strong>Name:</strong> {profile.name}</p>
                <p><strong>Age:</strong> {profile.age}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Preferences:</strong> {profile.preferences}</p>
                <p><strong>Personality Type:</strong> {profile.personality}</p>
                <p><strong>Theme:</strong> {theme.charAt(0).toUpperCase() + theme.slice(1)}</p>
                <button onClick={() => setEditProfile(true)}>Edit</button>
              </>
            )}
            <button onClick={() => { setShowProfile(false); setEditProfile(false); }} style={{background: 'var(--muted)', color: '#fff'}}>Close</button>
          </div>
        </div>
      )}

      <main className="chat-main">
        <div className="chat-history">
          {messages.length === 0 && (
            <div className="empty-chat">Start a conversation with <b>{persona.name}</b>!</div>
          )}
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chat-bubble ${msg.from === 'user' ? 'user' : 'bot'}`}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              {msg.from === 'bot' && (
                <span className="avatar" style={{marginRight: '0.7em', fontSize: '1.3em'}}>{persona.avatar}</span>
              )}
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
        <div className="chat-input-row">
          <textarea
            rows="2"
            placeholder={`Message ${persona.name}...`}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <button className="send-btn" onClick={handleSend}>
            ➤
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
