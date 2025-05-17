// components/Login.jsx
// Login.jsx

import React, { useState } from "react";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter both username and password!");
      return;
    }
    onLogin(username, password);
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/background.jpg')",
      }}
    >
      {/* Optional blur/dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded shadow-md flex flex-col gap-4 w-80 z-10"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-white">Login</h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white outline-none"
        />

        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white py-2 rounded mt-4"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
