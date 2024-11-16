import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";

const LoginForm: React.FC = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState(
    localStorage.getItem("rememberedEmail") || ""
  );
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(
    !!localStorage.getItem("rememberedEmail")
  );
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address");
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
      setError(
        "Password must be at least 6 characters with one letter and one digit"
      );
      return;
    }

    const success = await login(email, password, rememberMe);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  return (
    <div>
      <h2 className="mb-12 mt-6 text-center text-2xl font-bold leading-tight sm:text-3xl text-nowrap">
        SIGN IN TO YOUR ACCOUNT
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Username"
        className="border p-2 w-full mb-4 rounded-2xl bg-inputBG h-12"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 w-full mb-4 rounded-2xl bg-inputBG h-12"
      />
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          className="mr-2"
        />
        Remember me
      </label>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="flex justify-center bg-gradient-to-b from-customGold to-customBlue text-white m-auto px-10 py-3 my-10 rounded-2xl"
      >
        {loading ? "Logging in..." : "Login now"}
      </button>
    </div>
  );
};

export default LoginForm;
