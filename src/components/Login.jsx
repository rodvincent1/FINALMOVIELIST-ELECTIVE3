// components/Login.jsx
import React, { useState } from "react";

const Login = ({ onLogin, onRegister }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Please enter both username and password!");
      return;
    }

    if (isRegister) {
      onRegister(username, password);
    } else {
      onLogin(username, password);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/background1.png')",
      }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-8 rounded-lg shadow-xl flex flex-col gap-4 w-80 z-10"
      >
        <h2 className="text-3xl font-bold text-center mb-2 text-white">
          {isRegister ? "Register" : "Login"}
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white outline-none focus:ring-2 focus:ring-red-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 rounded bg-zinc-700 text-white outline-none focus:ring-2 focus:ring-red-500"
        />

        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-2 transition duration-300"
        >
          {isRegister ? "Create Account" : "Login"}
        </button>

        <p className="text-sm text-gray-300 text-center mt-2">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-red-400 hover:text-red-200 underline ml-1"
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;
