import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Users,
  BookOpen,
  Receipt,
  Package,
  Building2,
  UserCircle,
  ShoppingCart,
  Menu,
  X,
  PackagePlus,
  LogOut,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: PackagePlus,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  {
    name: "Administrator",
    href: "/dashboard/admin",
    icon: UserCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-500",
  },
  {
    name: "General Ledger",
    href: "/dashboard/general-ledger",
    icon: BookOpen,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500",
  },
  {
    name: "Accounts Receivable",
    href: "/dashboard/accounts-receivable",
    icon: Receipt,
    color: "text-amber-500",
    bgColor: "bg-amber-500",
  },
  {
    name: "Inventory",
    href: "/dashboard/inventory",
    icon: Package,
    color: "text-rose-500",
    bgColor: "bg-rose-500",
  },
  {
    name: "Fixed Assets",
    href: "/dashboard/fixed-assets",
    icon: Building2,
    color: "text-purple-500",
    bgColor: "bg-purple-500",
  },
  {
    name: "Payroll / HR",
    href: "/dashboard/payroll",
    icon: Users,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500",
  },
  {
    name: "Point of Sale",
    href: "/dashboard/pos",
    icon: ShoppingCart,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500",
  },
];

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, companyName, companyAddress, companyPhone } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="flex sticky top-0 z-40 md:hidden h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:gap-x-6 sm:px-6 lg:px-8 justify-between">
        <div className=" text-sm font-semibold leading-6 text-gray-900 dark:text-white">
          <img src="assets/logo.png" alt="FlexSoft Logo" className="h-8" />
        </div>
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-gray-200"
          onClick={() => setIsOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-50 lg:hidden ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-gray-900/80"
          onClick={() => setIsOpen(false)}
        />

        <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 dark:sm:ring-gray-700/10">
          <div className="flex items-center justify-between">
            <div className="-m-1.5 p-1.5">
              <img src="assets/logo.png" alt="FlexSoft Logo" className="h-8" />
            </div>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-gray-700 dark:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Company Info for Mobile */}
          <div className="mt-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {companyName}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Your Complete Business Solution
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {companyAddress}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {companyPhone}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10 dark:divide-gray-700/10">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group -mx-3 flex items-center gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 ${
                      location.pathname === item.href
                        ? "bg-gray-50 text-gray-900 dark:bg-gray-700/50 dark:text-white"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:hover:text-white"
                    }`}
                  >
                    <item.icon
                      className={`h-5 w-5 shrink-0 ${item.color}`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
                <button
                  className="group -mx-3 flex w-full items-center gap-x-3 rounded-md p-3 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 shrink-0 text-red-500" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <img src="assets/logo.png" alt="FlexSoft Logo" className="h-8" />
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {companyName}
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Your Complete Business Solution
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {companyAddress}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {companyPhone}
                </p>
              </div>
            </div>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 ${
                          location.pathname === item.href
                            ? "bg-gray-50 text-gray-900 dark:bg-gray-700/50 dark:text-white"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:hover:text-white"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 shrink-0 ${item.color}`}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  className="group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-200 dark:hover:bg-gray-700/50 dark:hover:text-white"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 shrink-0 text-red-500" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
