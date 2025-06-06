import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("userData");
      }
    }
    setLoading(false);
  }, []);

  const login = async (clientId, username, password) => {
    try {
      const response = await apiLogin(clientId, username, password);

      if (response && response.status === true) {
        const userData = {
          ...response.data,
          token: response.status2,
          companyInfo: response.status2
            ? JSON.parse(atob(response.status2.split(".")[1]))
            : null,
        };

        setUser(userData);
        // Store only non-sensitive data in localStorage
        localStorage.setItem(
          "userData",
          JSON.stringify({
            acctyears: userData.acctyears,
            userinfo: {
              AcctYear: userData.userinfo.AcctYear,
              CompanyAddress: userData.userinfo.CompanyAddress,
              CompanyCode: userData.userinfo.CompanyCode,
              CompanyName: userData.userinfo.CompanyName,
              CompanyPhoneNumber: userData.userinfo.CompanyPhoneNumber,
              EmailAddress: userData.userinfo.EmailAddress,
              Executive: userData.userinfo.Executive,
              ExpiryDate: userData.userinfo.ExpiryDate,
              FullName: userData.userinfo.FullName,
              ModuleIndustries: userData.userinfo.ModuleIndustries,
              UserId: userData.userinfo.UserId,
              UserType: userData.userinfo.UserType,
              userpermissions: userData.userinfo.userpermissions,
            },
            companyInfo: {
              CoyName: userData.companyInfo?.CoyName,
              CoyCode: userData.companyInfo?.CompanyCode,
              ExpDate: userData.companyInfo?.ExpDate,
            },
          })
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("userData");
    navigate("/");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    // User Info
    userRole: user?.userinfo?.UserType,
    userName: user?.userinfo?.FullName,
    userEmail: user?.userinfo?.EmailAddress,
    userId: user?.userinfo?.UserId,
    userPermissions: user?.userinfo?.userpermissions,
    // Company Info
    companyName: user?.userinfo?.CompanyName,
    companyCode: user?.userinfo?.CompanyCode,
    companyAddress: user?.userinfo?.CompanyAddress,
    companyPhone: user?.userinfo?.CompanyPhoneNumber,
    // Module Info
    moduleIndustries: user?.userinfo?.ModuleIndustries,
    isExecutive: user?.userinfo?.Executive === "Yes",
    // Accounting Info
    accountingYears: user?.acctyears || [],
    currentAccountingYear: user?.userinfo?.AcctYear,
    // Expiry Info
    expiryDate: user?.userinfo?.ExpiryDate,
    // Complete Objects
    userInfo: user?.userinfo,
    companyInfo: user?.companyInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
