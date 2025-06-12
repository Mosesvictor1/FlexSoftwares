import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login as apiLogin } from "../services/api";
import Cookies from "js-cookie";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clientInfo, setClientInfo] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("userData");
    const storedClientInfo = localStorage.getItem("clientInfo");
    const storedCompany = localStorage.getItem("selectedCompany");

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        if (storedClientInfo) {
          setClientInfo(JSON.parse(storedClientInfo));
        }
        if (storedCompany) {
          setSelectedCompany(JSON.parse(storedCompany));
        }
      } catch (error) {
        console.error("Error parsing stored data:", error);
        localStorage.removeItem("userData");
        localStorage.removeItem("clientInfo");
        localStorage.removeItem("selectedCompany");
      }
    }
    setLoading(false);
  }, []);

  const setClientData = (data) => {
    setClientInfo(data);
    localStorage.setItem("clientInfo", JSON.stringify(data));

    // If there are companies and none is selected, select the first one
    if (data.companyinfo?.length > 0 && !selectedCompany) {
      setSelectedCompany(data.companyinfo[0]);
      localStorage.setItem(
        "selectedCompany",
        JSON.stringify(data.companyinfo[0])
      );
    }
  };

  const login = async (clientId, username, password, selectedCompany) => {
    console.log("ddddd===", clientId, username, password, selectedCompany);
    try {
      const response = await apiLogin(
        clientId,
        username,
        password,
        selectedCompany
      );

      if (response && response.status === true) {
        const userData = {
          ...response.data,
          token: response.status2,
          companyInfo: response.status2
            ? JSON.parse(atob(response.status2.split(".")[1]))
            : null,
        };

        setUser(userData);
        Cookies.set("token", userData.token);
        // Store only non-sensitive data in localStorage
        localStorage.setItem(
          "userData",
          JSON.stringify({
            token: userData.token,
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

  const setCompany = (company) => {
    setSelectedCompany(company);
    localStorage.setItem("selectedCompany", JSON.stringify(company));
  };

  const logout = () => {
    // Save client ID and client info before clearing user data
    const clientId = localStorage.getItem("clientId");
    const clientInfo = localStorage.getItem("clientInfo");

    // Clear user data
    setUser(null);
    setSelectedCompany(null);
    localStorage.removeItem("userData");
    localStorage.removeItem("selectedCompany");

    // Restore client ID and client info
    if (clientId) localStorage.setItem("clientId", clientId);
    if (clientInfo) localStorage.setItem("clientInfo", clientInfo);

    navigate("/login");
  };

  const value = {
    user,
    loading,
    login,
    logout,
    clientInfo,
    setClientData,
    selectedCompany,
    setCompany,
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
