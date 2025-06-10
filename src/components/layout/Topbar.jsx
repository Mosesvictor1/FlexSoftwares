import {
  Bell,
  Search,
  Sun,
  Moon,
  Settings,
  LogOut,
  KeyRound,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Topbar({ userRole, userName }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef(null);
  const navigate = useNavigate();
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleChangePassword = () => {
    navigate("/change-password");
    setIsSettingsOpen(false);
  };

  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400" />
          <input
            id="search-field"
            className="block h-full w-full border-0 py-0 pl-8 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 dark:bg-gray-800 dark:text-white sm:text-sm"
            placeholder="Search..."
            type="search"
            name="search"
          />
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
          >
            <span className="sr-only">Toggle theme</span>
            {isDarkMode ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>

          {/* Notifications */}
          <button
            type="button"
            className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700"
            aria-hidden="true"
          />

          {/* Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-200"
            >
              <span className="sr-only">Settings</span>
              <Settings className="h-6 w-6" />
            </button>

            {/* Dropdown Menu */}
            {isSettingsOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-gray-800 dark:ring-gray-700">
                <button
                  onClick={handleChangePassword}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <KeyRound className="mr-3 h-5 w-5" />
                  Change Password
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex items-center gap-x-4">
            <div className="hidden lg:flex lg:flex-col">
              <span className="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                {userName}
              </span>
              <span className="text-xs leading-5 text-gray-500 dark:text-gray-400">
                {userRole}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Topbar;
