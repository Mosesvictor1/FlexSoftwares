import { useEffect, useState } from "react";
import { fetchTransactionDropdowns } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Cookies from "js-cookie";

export function useTransactionDropdowns(transSource) {
  const { currentAccountingYear, user } = useAuth();
  const [dropdownData, setDropdownData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = Cookies.get("token");
        const data = await fetchTransactionDropdowns(
          currentAccountingYear,
          transSource,
          token
        );
        console.log(transSource, "==", data, "data.data==", data.data)
        setDropdownData(data.data);
      } catch {
        setError("Failed to load dropdown data");
      } finally {
        setLoading(false);
      }
    };
    if (currentAccountingYear && user?.token) {
      fetchData();
    }
  }, [currentAccountingYear, user, transSource]);

  return { dropdownData, loading, error };
}
