import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement password reset logic
    console.log("Password reset requested for:", email);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Column - Illustration */}
      <div className="hidden lg:flex lg:w-[44%] bg-primary relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <img
            src="assets/illustration3.png"
            alt="Forgot Password Illustration"
            className="w-full h-full"
          />
        </div>
        <div className="absolute top-12 left-0 right-0 p-8 text-black">
          <h2 className="text-2xl font-bold mb-2 text-center">
            Reset Your Password
          </h2>
          <p className="text-black text-lg text-center">
            We'll help you get back into your account
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
              Forgot your password?
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-100">
              Enter your email address and we'll send you a link to reset your
              password
            </p>
          </div>

          {!isSubmitted ? (
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-400 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>
                <Button type="submit" className="dark:bg-gray-800">Send Reset Link</Button>
              </div>
            </form>
          ) : (
            <div className="mt-8 space-y-6 text-center">
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-green-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Reset link sent
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>
                        We've sent a password reset link to {email}. Please
                        check your email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                Return to Login
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
