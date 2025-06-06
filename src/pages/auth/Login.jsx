import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { FaUser, FaLock } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [clientId, setClientId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect to dashboard or intended destination
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
      return;
    }

    // Retrieve client ID from localStorage
    const storedClientId = localStorage.getItem("clientId");
    if (!storedClientId) {
      // If no client ID is found, redirect back to client ID page
      navigate("/");
      return;
    }
    setClientId(storedClientId);
  }, [navigate, isAuthenticated, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password");
      return;
    }

    setLoading(true);
    try {
      const success = await login(clientId, username, password);
      if (success) {
        // Redirect to the page they tried to visit or dashboard
        const from = location.state?.from?.pathname || "/dashboard";
        navigate(from, { replace: true });
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("Login failed. Please check your credentials.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Illustration */}
      <div className="hidden lg:flex lg:w-[44%] bg-primary relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="assets/illustration2.png"
            alt="Login Illustration"
            className="w-full h-full"
          />
        </div>
        <div className="absolute top-12 left-0 right-0 p-8 text-black">
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back!</h2>
          <p className="text-black text-lg text-center">
            Sign in to access your account
          </p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-full lg:w-[56%] flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center">
            <img
              src="assets/logo.png"
              alt="FlexSoft Logo"
              className="h-12 mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200">
              Sign In
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Please sign in to continue
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  User ID
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    className="appearance-none rounded-md relative block w-full  px-3 py-2 border border-gray-400 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="appearance-none rounded-md relative block w-full  px-3 py-2 border border-gray-400 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                  />
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="/forgot-password"
                  className="font-medium text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full dark:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
