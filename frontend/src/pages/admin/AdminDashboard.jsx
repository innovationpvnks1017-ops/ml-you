import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const [stats, setStats] = useState({
    userCount: 0,
    trainingCount: 0,
    logCount: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const usersRes = await axios.get("/admin/users?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const trainingsRes = await axios.get("/admin/trainings?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const logsRes = await axios.get("/admin/logs?limit=1", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats({
          userCount: usersRes.headers["x-total-count"] || usersRes.data.length || 0,
          trainingCount: trainingsRes.headers["x-total-count"] || trainingsRes.data.length || 0,
          logCount: logsRes.headers["x-total-count"] || logsRes.data.length || 0,
        });
      } catch (e) {
        // Fallback count from data length
        setStats({
          userCount: 0,
          trainingCount: 0,
          logCount: 0,
        });
      }
    }
    fetchStats();
  }, [token]);

  return (
    <div className="max-w-4xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard Overview</h2>
      <div className="grid grid-cols-3 gap-6 text-center">
        <div className="bg-purple-600 text-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold">Users</h3>
          <p className="text-4xl font-extrabold">{stats.userCount}</p>
        </div>
        <div className="bg-pink-600 text-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold">Trainings</h3>
          <p className="text-4xl font-extrabold">{stats.trainingCount}</p>
        </div>
        <div className="bg-indigo-600 text-white rounded-lg p-6 shadow-md">
          <h3 className="text-xl font-semibold">Logs</h3>
          <p className="text-4xl font-extrabold">{stats.logCount}</p>
        </div>
      </div>
    </div>
  );
}
