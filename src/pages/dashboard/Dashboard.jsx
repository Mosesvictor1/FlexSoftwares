import {
  Users,
  BookOpen,
  Receipt,
  Package,
  Building2,
  UserCircle,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Clock,
  ChevronDown,
} from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Sidebar from "../../components/layout/Sidebar";
// import { useTheme } from "../../context/ThemeContext";
import { useEffect, useState } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../../context/AuthContext";
import { Routes, Route } from "react-router-dom";
import { getDashboardAnalytics } from "../../services/api";
import { CreateInvoice, InvoiceList } from "../pos";

const stats = [
  {
    id: 1,
    title: "Total Revenue",
    value: "$24,500",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up",
    period: "vs last month",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Active Users",
    value: "1,234",
    change: "+8.2%",
    icon: Users,
    trend: "up",
    period: "vs last week",
    color: "bg-emerald-500",
  },
  {
    id: 3,
    title: "Pending Invoices",
    value: "45",
    change: "-2.4%",
    icon: Receipt,
    trend: "down",
    period: "vs last month",
    color: "bg-amber-500",
  },
  {
    id: 4,
    title: "Low Stock Items",
    value: "12",
    change: "+3.1%",
    icon: Package,
    trend: "up",
    period: "vs last week",
    color: "bg-rose-500",
  },
];

const quickActions = [
  { id: 1, name: "New Sale", icon: ShoppingCart, color: "bg-blue-500" },
  { id: 2, name: "New Credit Sale", icon: Receipt, color: "bg-emerald-500" },
  { id: 3, name: "Add Product", icon: Package, color: "bg-amber-500" },
  { id: 4, name: "New Goods Received Note", icon: Users, color: "bg-rose-500" },
];

function Dashboard() {
  const {
    userRole,
    userName,
    userId,
    accountingYears,
    currentAccountingYear,
    companyInfo,
  } = useAuth();

  const [accountingYear, setAccountingYear] = useState(
    currentAccountingYear || "2024"
  );
  const [recentActivitiess, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const subscriptionExpiry = companyInfo?.ExpDate || "2024-12-31";

  useEffect(() => {
    Aos.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    async function resentSales() {
      try {
        const data = await getDashboardAnalytics(accountingYear);
        setRecentActivities(data?.data || []);
      } catch (error) {
        console.error(error);
        throw error;
      } finally {
        setIsLoading(false); 
      }
    }
    resentSales();
  }, [accountingYear]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar userRole={userName} userName={userRole} />

        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              {/* Default Dashboard View */}
              <Route
                path="/"
                element={
                  <>
                    {/* Welcome Section with Accounting Year and Subscription Info */}
                    <div className="mb-8">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h1
                            className="text-2xl font-bold text-gray-900 dark:text-white"
                            data-aos="fade-up"
                          >
                            Welcome back, {userId}
                          </h1>
                          <p
                            className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                            data-aos="fade-up"
                          >
                            Here's what's happening with your business today.
                          </p>
                        </div>
                        <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-4">
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor="accounting-year"
                              className="text-sm font-medium text-gray-700 dark:text-gray-300"
                              data-aos="fade-up"
                            >
                              Accounting Year:
                            </label>
                            <div className="relative">
                              <select
                                id="accounting-year"
                                value={accountingYear}
                                onChange={(e) =>
                                  setAccountingYear(e.target.value)
                                }
                                className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6 dark:bg-gray-800 dark:text-white dark:ring-gray-700"
                                data-aos="fade-up"
                              >
                                {accountingYears.map((year) => (
                                  <option
                                    key={year.AcctYear}
                                    value={year.AcctYear}
                                  >
                                    {year.AcctYear}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                          <div
                            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                            data-aos="fade-up"
                          >
                            <Calendar className="h-4 w-4" />
                            <span>
                              Subscription Expires On:{" "}
                              {new Date(
                                subscriptionExpiry
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                      {stats.map((stat) => (
                        <div
                          key={stat.title}
                          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                          data-aos="zoom-in"
                          data-aos-delay={`${(stat.id % 3) * 100}`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {stat.title}
                              </p>
                              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                                {stat.value}
                              </p>
                            </div>
                            <div
                              className={`h-12 w-12 rounded-lg ${stat.color} bg-opacity-10 flex items-center justify-center`}
                            >
                              <stat.icon
                                className={`h-6 w-6 ${stat.color.replace(
                                  "bg-",
                                  "text-"
                                )}`}
                              />
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center">
                              {stat.trend === "up" ? (
                                <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-rose-500" />
                              )}
                              <span
                                className={`ml-1 text-sm font-medium ${
                                  stat.trend === "up"
                                    ? "text-emerald-500"
                                    : "text-rose-500"
                                }`}
                              >
                                {stat.change}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {stat.period}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mb-8">
                      <h2
                        className="text-lg font-medium text-gray-900 dark:text-white mb-4"
                        data-aos="fade-up"
                      >
                        Quick Actions
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {quickActions.map((action) => (
                          <button
                            key={action.name}
                            className="flex items-center justify-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
                            data-aos="zoom-in"
                            data-aos-delay={`${(action.id % 3) * 100}`}
                          >
                            <div
                              className={`h-10 w-10 rounded-lg ${action.color} bg-opacity-10 flex items-center justify-center`}
                            >
                              <action.icon
                                className={`h-5 w-5 ${action.color.replace(
                                  "bg-",
                                  "text-"
                                )}`}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {action.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h2
                            className="text-lg font-medium text-gray-900 dark:text-white"
                            data-aos="fade-up"
                          >
                            Recent Sales
                          </h2>
                          <button className="text-sm text-primary hover:text-primary/90 dark:text-primary-400 dark:hover:text-primary-300">
                            View all
                          </button>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {isLoading ? (
                          <div className="flex justify-center items-center py-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                          </div>
                        ) : (
                          <>
                            {recentActivitiess.length < 1 ? (
                              <div className=" flex items-center justify-center my-4 bg font-medium text-red-500">
                                Sales data is unavailable for the selected year
                                ({accountingYear}). Please check another period
                                or update your records.{" "}
                              </div>
                            ) : (
                              <dive>
                                {recentActivitiess.map((activity) => (
                                  <div
                                    key={activity.id}
                                    className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                    data-aos="zoom-in"
                                    data-aos-delay={`${
                                      (activity.id % 3) * 100
                                    }`}
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div
                                          className={`h-8 w-8 rounded-full ${
                                            activity.status === "success"
                                              ? "bg-emerald-100 dark:bg-emerald-900/30"
                                              : "bg-amber-100 dark:bg-amber-900/30"
                                          } flex items-center justify-center`}
                                        >
                                          <AlertCircle
                                            className={`h-4 w-4 ${
                                              activity.status === "success"
                                                ? "text-emerald-500"
                                                : "text-amber-500"
                                            }`}
                                          />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                                            {activity.SalesDesc}
                                          </p>
                                          <div className="flex items-center mt-1">
                                            <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                              {activity.HowLong}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        ${activity.ItemAmount}
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </dive>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </>
                }
              />

              {/* POS Routes */}
              <Route path="/pos/invoice/create" element={<CreateInvoice />} />
              <Route path="/pos/invoice/list" element={<InvoiceList />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-gray-200  dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © Copyright CompuClick Software Ltd. www.theflexsoft.com. All
              rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;
