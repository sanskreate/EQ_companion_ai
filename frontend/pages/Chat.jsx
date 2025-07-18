// Chat page component

import React, { useState, useEffect } from 'react';

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
  {
    name: 'Krish',
    file: 'persona-configs/krish.json',
    avatar: '🧑',
    desc: 'Focused, Goal-Oriented, Means-Business',
  },
];

export default function Chat({ isAuthenticated, onRequireAuth }) {
  const [personas, setPersonas] = useState(defaultPersonas);
  const [userInput, setUserInput] = useState('');
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

  useEffect(() => {
    async function loadConfigPersonas() {
      try {
        const personaFiles = [
          'persona-configs/aarav.json',
          'persona-configs/rhea.json',
          'persona-configs/leo.json',
          'persona-configs/krish.json',
        ];
        const loaded = await Promise.all(personaFiles.map(async (file) => {
          try {
            const res = await fetch(`/${file}`);
            if (!res.ok) return null;
            const data = await res.json();
            return {
              name: data.name,
              file,
              avatar: '🧑', // Default avatar, you can customize per persona
              desc: (data.traits || []).join(', '),
              ...data,
            };
          } catch {
            return null;
          }
        }));
        const filtered = loaded.filter(Boolean);
        // Merge with defaultPersonas, avoiding duplicates
        setPersonas(prev => {
          const names = new Set(prev.map(p => p.name));
          const merged = [...prev, ...filtered.filter(p => !names.has(p.name))];
          return merged;
        });
      } catch {}
    }
    loadConfigPersonas();
  }, []);

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
    if (!isAuthenticated && onRequireAuth) {
      onRequireAuth();
      return;
    }
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
      // Add to local personas list and set as selected
      const personaFile = `persona-configs/${newPersona.name.toLowerCase()}.json`;
      const newP = { ...personaObj, file: personaFile, avatar: randomAvatar(), desc: (personaObj.traits || []).join(', ') };
      setPersonas(ps => [...ps, newP]);
      setPersona(newP); // Set the new persona as selected
      setMessages([]);
      setShowPersonaModal(false);
      setNewPersona({ name: '', type: '', traits: '', tone: '', attachment_style: '', love_language: '' });
    } catch (err) {
      setPersonaError('Failed to create persona.');
    }
  };

  return (
    <div className={`app-container ${theme}`}>
      <header className="header">
        <div className="persona-switcher" style={{display: 'flex', alignItems: 'center', gap: '1.5rem'}}>
          <select
            className="persona-dropdown"
            value={persona.name}
            onChange={e => {
              if (e.target.value === '__custom__') {
                setShowPersonaModal(true);
                return;
              }
              const p = personas.find(p => p.name === e.target.value);
              if (p) handlePersonaChange(p);
            }}
            style={{fontSize: '1.1rem', borderRadius: '10px', padding: '0.5em 1.2em', border: '1.5px solid var(--border)', background: 'var(--button-bg)', color: 'var(--button-fg)', fontWeight: 500, maxHeight: '160px', overflowY: 'auto'}}
          >
            {personas.map(p => (
              <option key={p.name} value={p.name}>{p.avatar} {p.name}</option>
            ))}
            <option value="__custom__">➕ Create a custom person...</option>
          </select>
      {/* Custom Persona Modal */}
      {showPersonaModal && (
        <div className="profile-modal">
          <div className="profile-content">
            <h3>Create a Custom Persona</h3>
            <form onSubmit={handleCreatePersona} style={{display: 'flex', flexDirection: 'column', gap: 8}}>
              <label>Name*</label>
              <input value={newPersona.name} onChange={e => setNewPersona(p => ({...p, name: e.target.value}))} required />
              <label>Type*</label>
              <input value={newPersona.type} onChange={e => setNewPersona(p => ({...p, type: e.target.value}))} required placeholder="e.g. Crush, Friend, Mentor" />
              <label>Traits* (comma separated)</label>
              <input value={newPersona.traits} onChange={e => setNewPersona(p => ({...p, traits: e.target.value}))} required placeholder="e.g. Witty, Supportive, Ambitious" />
              <label>Tone*</label>
              <input value={newPersona.tone} onChange={e => setNewPersona(p => ({...p, tone: e.target.value}))} required placeholder="e.g. Warm and teasing" />
              <label>Attachment Style*</label>
              <input value={newPersona.attachment_style} onChange={e => setNewPersona(p => ({...p, attachment_style: e.target.value}))} required placeholder="e.g. Secure" />
              <label>Love Language*</label>
              <input value={newPersona.love_language} onChange={e => setNewPersona(p => ({...p, love_language: e.target.value}))} required placeholder="e.g. Words of Affirmation" />
              {personaError && <div style={{color: 'red'}}>{personaError}</div>}
              <button type="submit" style={{marginTop: 8}}>Create Persona</button>
              <button type="button" onClick={() => { setShowPersonaModal(false); setPersonaError(''); }} style={{background: 'var(--muted)', color: '#fff'}}>Cancel</button>
            </form>
          </div>
        </div>
      )}
          <div className="persona-brief" style={{fontSize: '1.1rem', color: 'var(--muted)'}}>
            <span style={{fontWeight: 600, color: 'var(--accent)', marginRight: 6}}>{persona.avatar} {persona.name}:</span>
            <span>{persona.desc}</span>
          </div>
        </div>
        <div className="header-actions">
          <button className="theme-toggle" onClick={handleThemeToggle}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button className="profile-btn" onClick={() => {
            if (!isAuthenticated) {
              window.location.href = '/login';
              return;
            }
            setShowProfile((v) => !v);
          }}>
            👤
          </button>
        </div>
      </header>

      {showProfile && isAuthenticated && (
        <div className="profile-modal" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.25)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div className="profile-content" style={{
            background: 'var(--modal-bg, #fff0f6)',
            borderRadius: 18,
            boxShadow: '0 4px 32px #d7266022',
            padding: '2rem 1.5rem',
            width: 350,
            maxWidth: '90vw',
            maxHeight: 520,
            minHeight: 320,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}>
            <h3 style={{marginBottom: 0}}>Edit Profile</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              <label>Name*</label>
              <input value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} required style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Date of Birth*</label>
              <input type="date" value={profile.dob || ''} onChange={e => setProfile(p => ({ ...p, dob: e.target.value }))} required style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Gender*</label>
              <input value={profile.gender || ''} onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))} required style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Preferred Gender (optional)</label>
              <input value={profile.preferred_gender || ''} onChange={e => setProfile(p => ({ ...p, preferred_gender: e.target.value }))} style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Personality Type or Description*</label>
              <input value={profile.personality || ''} onChange={e => setProfile(p => ({ ...p, personality: e.target.value }))} required style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Love Language (optional)</label>
              <input value={profile.love_language || ''} onChange={e => setProfile(p => ({ ...p, love_language: e.target.value }))} style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Ideal Trait (optional)</label>
              <input value={profile.ideal_trait || ''} onChange={e => setProfile(p => ({ ...p, ideal_trait: e.target.value }))} style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Deal Breakers (optional)</label>
              <input value={profile.deal_breakers || ''} onChange={e => setProfile(p => ({ ...p, deal_breakers: e.target.value }))} style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Preferred Tone (optional)</label>
              <input value={profile.preferred_tone || ''} onChange={e => setProfile(p => ({ ...p, preferred_tone: e.target.value }))} style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Attachment Style (optional)</label>
              <input value={profile.attachment_style || ''} onChange={e => setProfile(p => ({ ...p, attachment_style: e.target.value }))} style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
              <label>Email</label>
              <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} style={{padding: 7, borderRadius: 7, border: '1px solid #e0b1c2'}} />
            </div>
            <div style={{display: 'flex', gap: 10, marginTop: 10}}>
              <button onClick={() => { setShowProfile(false); setEditProfile(false); }} style={{flex: 1}}>Save</button>
              <button onClick={() => { setShowProfile(false); setEditProfile(false); }} style={{ background: 'var(--muted)', color: '#fff', flex: 1 }}>Close</button>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('token');
                window.location.reload();
              }}
              style={{ marginTop: 16, background: '#d72660', color: '#fff', borderRadius: 8, padding: '0.7em 0', fontWeight: 600 }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {showPersonaModal && (
        isAuthenticated ? (
          <div className="profile-modal">
            <div className="profile-content">
              <h3>Create a Custom Persona</h3>
              <form onSubmit={handleCreatePersona} style={{display: 'flex', flexDirection: 'column', gap: 8}}>
                <label>Name*</label>
                <input value={newPersona.name} onChange={e => setNewPersona(p => ({...p, name: e.target.value}))} required />
                <label>Type*</label>
                <input value={newPersona.type} onChange={e => setNewPersona(p => ({...p, type: e.target.value}))} required placeholder="e.g. Crush, Friend, Mentor" />
                <label>Traits* (comma separated)</label>
                <input value={newPersona.traits} onChange={e => setNewPersona(p => ({...p, traits: e.target.value}))} required placeholder="e.g. Witty, Supportive, Ambitious" />
                <label>Tone*</label>
                <input value={newPersona.tone} onChange={e => setNewPersona(p => ({...p, tone: e.target.value}))} required placeholder="e.g. Warm and teasing" />
                <label>Attachment Style*</label>
                <input value={newPersona.attachment_style} onChange={e => setNewPersona(p => ({...p, attachment_style: e.target.value}))} required placeholder="e.g. Secure" />
                <label>Love Language*</label>
                <input value={newPersona.love_language} onChange={e => setNewPersona(p => ({...p, love_language: e.target.value}))} required placeholder="e.g. Words of Affirmation" />
                {personaError && <div style={{color: 'red'}}>{personaError}</div>}
                <button type="submit" style={{marginTop: 8}}>Create Persona</button>
                <button type="button" onClick={() => { setShowPersonaModal(false); setPersonaError(''); }} style={{background: 'var(--muted)', color: '#fff'}}>Cancel</button>
              </form>
            </div>
          </div>
        ) : (
          (() => { window.location.href = '/login'; return null; })()
        )
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
