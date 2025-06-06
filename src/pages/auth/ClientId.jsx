import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { verifyClientId } from "../../services/api";

function ClientId() {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientId.trim()) {
      setError("Please enter your Client ID");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyClientId(clientId);
      console.log("Verification response:", response);

      if (response && response.status === true) {
        // Store client ID and client info in localStorage for future use
        localStorage.setItem("clientId", clientId);
        if (response.data && response.data.clientinfo) {
          localStorage.setItem(
            "clientInfo",
            JSON.stringify(response.data.clientinfo)
          );
        }
        navigate("/login");
      } else {
        navigate("/invalid-client");
      }
    } catch (error) {
      setError("Failed to verify client ID. Please try again.");
      console.error("Verification error:", error);
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
            alt="Client ID Illustration"
            className="w-full h-full"
          />
        </div>
        <div className="absolute top-12 left-0 right-0 p-8 text-black">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Welcome to FlexSoft
          </h2>
          <p className="text-black text-lg text-center">
            Enter your Client ID to access your account
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
              Enter Client ID
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              Please enter your Client ID to proceed to login
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="clientId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Client ID
              </label>
              <input
                id="clientId"
                name="clientId"
                type="text"
                required
                className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-400 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm dark:bg-gray-800 dark:text-white dark:border-gray-600"
                placeholder="Enter your Client ID"
                value={clientId}
                onChange={(e) => {
                  setClientId(e.target.value);
                  setError("");
                }}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full dark:bg-gray-800"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClientId;
