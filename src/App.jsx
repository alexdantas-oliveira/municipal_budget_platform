import React from "react";
import Routes from "./Routes";
import { AuthProvider } from './components/ui/RoleBasedNavigation';
import "./styles/tailwind.css";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;