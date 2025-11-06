import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AuthContext from "../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { token } = useContext(AuthContext);

  const [summary, setSummary] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    async function fetchSummary() {
      try {
        const res = await axios.get("/dashboard/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (e) {
        setSummary(null);
      }
    }
    async function fetchResults() {
      try {
        const res = await axios.get("/dashboard/results", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data);
      } catch (e) {
        setResults([]);
      }
    }
    fetchSummary();
    fetchResults();
  }, [token]);

  if (!summary) return <p>Loading dashboard...</p>;

  const barData = {
    labels: results.map((t) => new Date(t.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Accuracy",
        data: results.map((t) => t.results?.accuracy || 0),
        backgroundColor: "rgba(147, 51, 234, 0.7)",
      },
      {
        label: "F1 Score",
        data: results.map((t) => t.results?.f1_score || 0),
        backgroundColor: "rgba(236, 72, 153, 0.7)",
      },
    ],
  };

  const lineData = {
    labels: results.map((t) => new Date(t.created_at).toLocaleDateString()),
    datasets: [
      {
        label: "Success Rate",
        data: results.map((t) => (t.status === "completed" ? 1 : 0)),
        borderColor: "rgba(59, 130, 246, 0.7)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="max-w-5xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Dashboard Summary</h2>
      <div className="flex flex-wrap gap-6 justify-center mb-12">
        <div className="bg-purple-600 text-white rounded-lg p-6 w-48 text-center shadow-md">
          <h3 className="text-xl font-semibold">Total Trainings</h3>
          <p className="text-4xl font-extrabold">{summary.count}</p>
        </div>
        <div className="bg-pink-600 text-white rounded-lg p-6 w-48 text-center shadow-md">
          <h3 className="text-xl font-semibold">Last Training</h3>
          <p>{summary.last_training ? new Date(summary.last_training).toLocaleString() : "N/A"}</p>
        </div>
        <div className="bg-indigo-600 text-white rounded-lg p-6 w-48 text-center shadow-md">
          <h3 className="text-xl font-semibold">Success Rate</h3>
          <p className="text-4xl font-extrabold">{(summary.success_rate * 100).toFixed(1)}%</p>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">Training Metrics</h3>
      <div className="mb-12">
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>

      <h3 className="text-2xl font-semibold mb-4">Training Success Over Time</h3>
      <div>
        <Line data={lineData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>
    </div>
  );
}
