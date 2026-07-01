import { useState, useEffect, useCallback } from "react";
import axiosClient from "../api/axiosClient";

export const useReceipts = () => {
  const [receipts, setReceipts] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 10,
  });
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

    try {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, v]) => v !== "" && v !== null && v !== undefined)
      );

      const { data } = await axiosClient.get("/api/receipts", { params });

      setReceipts(data.data || []);
      setPagination(data.pagination || { total: 0, page: 1, totalPages: 1, limit: 10 });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch receipts");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const updateStatus = async (id, status) => {
    try {
      await axiosClient.patch(`/api/receipts/${id}/status`, { status });
      fetchReceipts();
    } catch (err) {
       console.log("Status Update Error:", err);
       console.log("Response:", err.response?.data);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const deleteReceipt = async (id) => {
    try {
      await axiosClient.delete(`/api/receipts/${id}`);
      fetchReceipts();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete receipt");
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
    deleteReceipt
  };
};