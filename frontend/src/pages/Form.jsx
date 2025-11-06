import React, { useState, useContext, useEffect, useRef } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";

export default function Form() {
  const { token } = useContext(AuthContext);

  const [parameters, setParameters] = useState({ target_column: "", model_params: {} });
  const [csvFile, setCsvFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const [trainingId, setTrainingId] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (trainingId) {
      const wsProtocol = window.location.protocol === "https:" ? "wss" : "ws";
      const wsUrl = `${wsProtocol}://${window.location.host}/ws/progress?training_id=${trainingId}`;
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setProgress(data.progress);
          setLogs((prev) => [...prev, `Progress: ${data.progress}%`]);
          if (data.progress >= 100) {
            wsRef.current.close();
          }
        } catch (e) {
          setLogs((prev) => [...prev, "Error parsing progress data"]);
        }
      };

      wsRef.current.onclose = () => {
        setLogs((prev) => [...prev, "Training completed or connection closed."]);
      };

      wsRef.current.onerror = () => {
        setLogs((prev) => [...prev, "WebSocket error occurred."]);
      };

      return () => {
        wsRef.current?.close();
      };
    }
  }, [trainingId]);

  function handleParameterChange(e) {
    const { name, value } = e.target;
    if (name.startsWith("model_params.")) {
      const key = name.split(".")[1];
      setParameters((prev) => ({
        ...prev,
        model_params: { ...prev.model_params, [key]: parseFloat(value) || value },
      }));
    } else {
      setParameters((prev) => ({ ...prev, [name]: value }));
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setCsvFile(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setProgress(0);
    setLogs([]);
    setTrainingId(null);

    let csvBytes = null;
    if (csvFile) {
      csvBytes = await csvFile.arrayBuffer();
    }

    const postData = {
      parameters,
      csv_file: csvBytes ? new Uint8Array(csvBytes) : undefined,
    };

    try {
      const response = await axios.post("/training/start", postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setTrainingId(response.data.id);
      setLogs((prev) => [...prev, "Training started..."]);
    } catch (error) {
      setLogs((prev) => [...prev, `Error: ${error.response?.data?.detail || error.message}`]);
    }
  }

  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">Start Training</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="font-semibold mb-2 block" htmlFor="target_column">
            Target Column
          </label>
          <input
            type="text"
            id="target_column"
            name="target_column"
            value={parameters.target_column}
            onChange={handleParameterChange}
            required
            className="w-full px-3 py-2 border rounded border-gray-300"
          />
        </div>
        <fieldset className="mb-4 border rounded p-4">
          <legend className="font-semibold mb-2">Model Parameters (Logistic Regression)</legend>
          <label className="block mb-2" htmlFor="model_params.C">
            Regularization Strength (C)
          </label>
          <input
            type="number"
            step="any"
            id="model_params.C"
            name="model_params.C"
            value={parameters.model_params.C || ""}
            onChange={handleParameterChange}
            className="w-full px-3 py-2 border rounded border-gray-300"
            placeholder="Default 1.0"
          />
          <label className="block mt-4 mb-2" htmlFor="model_params.max_iter">
            Max Iterations
          </label>
          <input
            type="number"
            id="model_params.max_iter"
            name="model_params.max_iter"
            value={parameters.model_params.max_iter || ""}
            onChange={handleParameterChange}
            className="w-full px-3 py-2 border rounded border-gray-300"
            placeholder="Default 100"
          />
        </fieldset>
        <div className="mb-6">
          <label className="font-semibold mb-2 block" htmlFor="csvFile">
            Upload CSV File (optional)
          </label>
          <input type="file" id="csvFile" accept=".csv" onChange={handleFileChange} />
          <p className="text-sm text-gray-500 mt-1">
            Provide CSV file or input data manually in parameters.
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition"
        >
          Start Training
        </button>
      </form>

      {trainingId && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">Training Progress</h3>
          <div className="w-full bg-gray-200 rounded h-6 mb-2">
            <div
              className="bg-purple-600 h-6 rounded"
              style={{ width: `${progress}%`, transition: "width 0.5s" }}
            />
          </div>
          <div className="max-h-48 overflow-y-auto bg-gray-50 p-3 rounded border border-gray-300 text-sm font-mono">
            {logs.map((log, idx) => (
              <div key={idx}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
