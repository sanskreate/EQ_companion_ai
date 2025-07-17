import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

// Consistent background for auth pages
const getBgClass = (theme) => theme === 'dark' ? 'bg-[#18141c]' : 'bg-[#fff0f6]';

export default function Login({ onLogin, theme = 'light' }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.username || !form.password) {
      setError("Please enter username and password.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(form),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.detail || "Login failed.");
        return;
      }
      const data = await res.json();
      setSuccess("Login successful!");
      localStorage.setItem("token", data.access_token);
      if (onLogin) onLogin();
      setTimeout(() => navigate('/'), 200);
    } catch (err) {
      setError("Login failed.");
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${getBgClass(theme)} transition-colors duration-300`}>
      <div className={`w-full max-w-md mx-auto p-8 rounded-2xl shadow-xl flex flex-col items-center ${theme === 'dark' ? 'bg-[#23182b] text-pink-100' : 'bg-white text-pink-900'}`}
        style={{ boxShadow: theme === 'dark' ? '0 4px 32px #1a1a1a' : '0 4px 32px #ffd6e0' }}>
        <h2 className="text-3xl font-extrabold mb-2 tracking-tight" style={{ color: theme === 'dark' ? '#ffb6d5' : '#d72660' }}>Welcome Back</h2>
        <p className="mb-6" style={{ color: theme === 'dark' ? '#f7c6e0' : '#a78bfa' }}>Sign in to your account</p>
        {localStorage.getItem('token') && (
          <button
            className={`mb-4 w-full py-2 rounded-lg font-semibold transition ${theme === 'dark' ? 'bg-pink-700 hover:bg-pink-800 text-white' : 'bg-pink-200 hover:bg-pink-300 text-pink-900'}`}
            onClick={() => {
              localStorage.removeItem('token');
              window.location.reload();
            }}
          >
            Logout
          </button>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" className={`w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-[#2a2033] border-pink-400 text-pink-100 focus:ring-pink-400' : 'bg-pink-50 border-pink-300 text-pink-900 focus:ring-pink-400'}`} />
          {error && <div className="text-red-400 text-center">{error}</div>}
          {success && <div className="text-green-400 text-center">{success}</div>}
          <button type="submit" className={`w-full py-2 rounded-lg font-semibold transition ${theme === 'dark' ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}>Login</button>
        </form>
        <div className="mt-6 text-center">
          <span className={theme === 'dark' ? 'text-pink-200' : 'text-pink-700'}>Don't have an account? </span>
          <Link to="/signup" className="underline font-semibold" style={{ color: theme === 'dark' ? '#ffb6d5' : '#d72660' }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
