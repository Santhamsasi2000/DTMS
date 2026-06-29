import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

export const useReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    date: "",
    page: 1,
    limit: 10,
  });

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setError("");
    try 
    {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ""));
      const { data } = await axios.get(`${API_BASE_URL}/api/receipts`, {params, });

      setReceipts(data.data);
      setPagination(data.pagination);
    } 
    catch (err) 
    {
      setError(err.response?.data?.message || "Failed to fetch receipts");
    } 
    finally 
    {
      setLoading(false);
    }
  }, [filters]);
 
  useEffect(() => { fetchReceipts(); },[fetchReceipts]);

  const updateStatus = async (id, status, action = "") => {
    try 
    {
      await axios.patch(`${API_BASE_URL}/api/receipts/${id}/status`, { status, action });
      fetchReceipts();
    } 
    catch (err) 
    {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  return {
    receipts,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    fetchReceipts,
    updateStatus,
  };
};