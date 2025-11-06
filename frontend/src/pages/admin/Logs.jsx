import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

export default function Logs() {
  const { token } = useContext(AuthContext);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({ user_id: "", action: "" });
  const [pagination, setPagination] = useState({ skip: 0, limit: 20 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, [filters, pagination.skip]);

  async function fetchLogs() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.user_id) params.append("user_id", filters.user_id);
      if (filters.action) params.append("action", filters.action);
      params.append("skip", pagination.skip.toString());
      params.append("limit", pagination.limit.toString());
      const res = await axios.get(`/admin/logs?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (e) {
      alert("Failed to fetch logs");
    }
    setLoading(false);
  }

  function handleFilterChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPagination((prev) => ({ ...prev, skip: 0 }));
  }

  return (
    <div className="max-w-6xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">System Logs</h2>
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <input
          type="number"
          name="user_id"
          placeholder="User ID"
          className="px-3 py-2 border rounded"
          value={filters.user_id}
          onChange={handleFilterChange}
          min={1}
        />
        <input
          type="text"
          name="action"
          placeholder="Action"
          className="px-3 py-2 border rounded"
          value={filters.action}
          onChange={handleFilterChange}
        />
      </div>
      {loading ? (
        <p>Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-center">No logs found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-left">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">User ID</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
              <th className="border border-gray-300 px-4 py-2">Details</th>
              <th className="border border-gray-300 px-4 py-2">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{log.id}</td>
                <td className="border border-gray-300 px-4 py-2">{log.user_id}</td>
                <td className="border border-gray-300 px-4 py-2">{log.action}</td>
                <td className="border border-gray-300 px-4 py-2">{log.details || "-"}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between mt-4">
        <button
          disabled={pagination.skip === 0}
          onClick={() => setPagination((p) => ({ ...p, skip: Math.max(p.skip - p.limit, 0) }))}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={logs.length < pagination.limit}
          onClick={() => setPagination((p) => ({ ...p, skip: p.skip + p.limit }))}
          className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
