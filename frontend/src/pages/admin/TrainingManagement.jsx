import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

export default function TrainingManagement() {
  const { token } = useContext(AuthContext);
  const [trainings, setTrainings] = useState([]);
  const [filters, setFilters] = useState({ status: "", user_id: "" });
  const [pagination, setPagination] = useState({ skip: 0, limit: 10 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrainings();
  }, [filters, pagination.skip]);

  async function fetchTrainings() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append("status", filters.status);
      if (filters.user_id) params.append("user_id", filters.user_id);
      params.append("skip", pagination.skip.toString());
      params.append("limit", pagination.limit.toString());
      const res = await axios.get(`/admin/trainings?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainings(res.data);
    } catch (e) {
      alert("Failed to fetch trainings");
    }
    setLoading(false);
  }

  async function deleteTraining(id) {
    if (!window.confirm("Are you sure you want to delete this training?")) return;
    try {
      await axios.delete(`/admin/trainings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTrainings();
    } catch (e) {
      alert("Failed to delete training");
    }
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }

  return (
    <div className="max-w-6xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Training Management</h2>
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <select
          name="status"
          className="px-3 py-2 border rounded"
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <input
          type="number"
          name="user_id"
          placeholder="User ID"
          className="px-3 py-2 border rounded"
          value={filters.user_id}
          onChange={handleFilterChange}
          min={1}
        />
      </div>
      {loading ? (
        <p>Loading trainings...</p>
      ) : trainings.length === 0 ? (
        <p className="text-center">No trainings found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-left">
          <thead>
            <tr className="bg-pink-600 text-white">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Version</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Created At</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trainings.map((t) => (
              <tr key={t.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{t.id}</td>
                <td className="border border-gray-300 px-4 py-2">{t.user_id}</td>
                <td className="border border-gray-300 px-4 py-2">{t.model_version}</td>
                <td className="border border-gray-300 px-4 py-2 capitalize">{t.status}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(t.created_at).toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => deleteTraining(t.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between mt-4">
        <button
          disabled={pagination.skip === 0}
          onClick={() => setPagination((p) => ({ ...p, skip: Math.max(p.skip - p.limit, 0) }))}
          className="bg-pink-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={trainings.length < pagination.limit}
          onClick={() => setPagination((p) => ({ ...p, skip: p.skip + p.limit }))}
          className="bg-pink-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
