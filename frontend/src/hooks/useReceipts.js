import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../../config";

const API = API_BASE_URL;

export const useReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    group: "",
    formType: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "")
      );
      const { data } = await axios.get(`${API}/api/receipts`, {
        headers: token ? { Authorization: `Bearer ${token}` }: {},
        params,
      });
      setReceipts(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch receipts");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const updateStatus = async (id, status, action = "") => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${API}/api/receipts/${id}/status`,
        { status, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReceipts();
    } catch (err) {
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