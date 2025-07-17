import React, { useState } from "react";

// Consistent background for auth pages
const getBgClass = (theme) => theme === 'dark' ? 'bg-[#18141c]' : 'bg-[#fff0f6]';

export default function Signup({ onSignup, theme = 'light' }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    preferred_gender: "",
    personality: "",
    love_language: "",
    ideal_trait: "",
    deal_breakers: "",
    preferred_tone: "",
    attachment_style: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Basic required field check
    if (!form.username || !form.email || !form.password || !form.dob || !form.gender || !form.personality) {
      setError("Please fill all required fields.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Signup failed.");
        return;
      }
      setSuccess("Signup successful! You can now log in.");
      if (onSignup) onSignup();
    } catch (err) {
      setError("Signup failed.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${getBgClass(theme)} transition-colors duration-300`}>
      <div className={`w-full max-w-md mx-auto p-8 rounded-2xl shadow-xl flex flex-col items-center ${theme === 'dark' ? 'bg-[#23182b] text-pink-100' : 'bg-white text-pink-900'}`}
        style={{ boxShadow: theme === 'dark' ? '0 4px 32px #1a1a1a' : '0 4px 32px #ffd6e0' }}>
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: theme === 'dark' ? '#ffb6d5' : '#d72660' }}>Create Account</h2>
        <p className="mb-6" style={{ color: theme === 'dark' ? '#f7c6e0' : '#a78bfa' }}>Sign up to personalize your experience</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input name="username" value={form.username} onChange={handleChange} placeholder="Username*" required className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email*" type="email" required className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password*" type="password" required className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="dob" value={form.dob} onChange={handleChange} placeholder="Date of Birth* (YYYY-MM-DD)" required className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="gender" value={form.gender} onChange={handleChange} placeholder="Gender*" required className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="preferred_gender" value={form.preferred_gender} onChange={handleChange} placeholder="Preferred Gender (optional)" className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="personality" value={form.personality} onChange={handleChange} placeholder="Personality Type or Description*" required className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="love_language" value={form.love_language} onChange={handleChange} placeholder="Love Language (optional)" className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="ideal_trait" value={form.ideal_trait} onChange={handleChange} placeholder="Ideal Trait (optional)" className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="deal_breakers" value={form.deal_breakers} onChange={handleChange} placeholder="Deal Breakers (optional)" className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="preferred_tone" value={form.preferred_tone} onChange={handleChange} placeholder="Preferred Tone (optional)" className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="attachment_style" value={form.attachment_style} onChange={handleChange} placeholder="Attachment Style (optional)" className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          {error && <div className="text-red-400 text-center">{error}</div>}
          {success && <div className="text-green-400 text-center">{success}</div>}
          <button type="submit" className={`w-full py-2 rounded-lg font-semibold transition ${theme === 'dark' ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}>Sign Up</button>
        </form>
      </div>
    </div>
  );
}
