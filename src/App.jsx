import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ClientId from "./pages/auth/ClientId";
import Dashboard from "./pages/dashboard/Dashboard";
import { ThemeProvider } from "./context/ThemeContext";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/client-id" element={<ClientId />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Redirect root to client ID page */}
            <Route path="/" element={<Navigate to="/client-id" replace />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
