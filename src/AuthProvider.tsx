import React from "react";
import { AuthProvider } from "./hooks/useAuth";
import App from "./App";

const Root: React.FC = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};

export default Root;
