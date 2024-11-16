import React from "react";
import LoginForm from "./components/LoginForm";
import Profile from "./components/Profile";
import { useAuth } from "./hooks/useAuth";

const App: React.FC = () => {
  const { isLoggedIn, email, logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-customGold to-customBlue">
      <div className="bg-white p-8 rounded-2xl w-[96%] mx-auto sm:max-w-md">
        {isLoggedIn ? <Profile email={email} logout={logout} /> : <LoginForm />}
      </div>
    </div>
  );
};

export default App;
