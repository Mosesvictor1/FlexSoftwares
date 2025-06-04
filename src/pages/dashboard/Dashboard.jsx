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
} from "lucide-react";
import Topbar from "../../components/layout/Topbar";
import Sidebar from "../../components/layout/Sidebar";
// import { useTheme } from "../../context/ThemeContext";

const stats = [
  {
    title: "Total Revenue",
    value: "$24,500",
    change: "+12.5%",
    icon: DollarSign,
    trend: "up",
    period: "vs last month",
    color: "bg-blue-500",
  },
  {
    title: "Active Users",
    value: "1,234",
    change: "+8.2%",
    icon: Users,
    trend: "up",
    period: "vs last week",
    color: "bg-emerald-500",
  },
  {
    title: "Pending Invoices",
    value: "45",
    change: "-2.4%",
    icon: Receipt,
    trend: "down",
    period: "vs last month",
    color: "bg-amber-500",
  },
  {
    title: "Low Stock Items",
    value: "12",
    change: "+3.1%",
    icon: Package,
    trend: "up",
    period: "vs last week",
    color: "bg-rose-500",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "sale",
    description: "New sale recorded - #INV-2024-001",
    amount: "$1,200",
    time: "5 minutes ago",
    status: "success",
  },
  {
    id: 2,
    type: "invoice",
    description: "Invoice #INV-2024-002 marked as paid",
    amount: "$850",
    time: "1 hour ago",
    status: "success",
  },
  {
    id: 3,
    type: "stock",
    description: "Low stock alert - Product #PRD-001",
    amount: "5 units left",
    time: "2 hours ago",
    status: "warning",
  },
];

const quickActions = [
  { name: "New Sale", icon: ShoppingCart, color: "bg-blue-500" },
  { name: "New Invoice", icon: Receipt, color: "bg-emerald-500" },
  { name: "Add Product", icon: Package, color: "bg-amber-500" },
  { name: "New User", icon: Users, color: "bg-rose-500" },
];

function Dashboard() {
  // TODO: Get this from auth context/state
  const userRole = "Admin";
  const userName = "John Doe";
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />

      <div className="lg:pl-64">
        <Topbar userRole={userRole} userName={userName} />

        <main className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="mb-8">
              
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {userRole}
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Here's what's happening with your business today.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((stat) => (
                <div
                  key={stat.title}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
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
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    className="flex items-center justify-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200"
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
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                    Recent Activities
                  </h2>
                  <button className="text-sm text-primary hover:text-primary/90 dark:text-primary-400 dark:hover:text-primary-300">
                    View all
                  </button>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
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
                            {activity.description}
                          </p>
                          <div className="flex items-center mt-1">
                            <Clock className="h-3 w-3 text-gray-400 dark:text-gray-500 mr-1" />
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
