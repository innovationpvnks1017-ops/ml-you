import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";

export default function UserManagement() {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ skip: 0, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [editUserId, setEditUserId] = useState(null);
  const [editData, setEditData] = useState({ is_active: false, is_admin: false });

  useEffect(() => {
    fetchUsers();
  }, [pagination.skip]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await axios.get(`/admin/users?skip=${pagination.skip}&limit=${pagination.limit}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (e) {
      alert("Failed to fetch users");
    }
    setLoading(false);
  }

  function startEdit(user) {
    setEditUserId(user.id);
    setEditData({ is_active: user.is_active, is_admin: user.is_admin });
  }

  function cancelEdit() {
    setEditUserId(null);
  }

  function handleChange(e) {
    const { name, checked } = e.target;
    setEditData((prev) => ({ ...prev, [name]: checked }));
  }

  async function saveEdit(userId) {
    try {
      await axios.put(
        `/admin/users/${userId}`,
        { is_active: editData.is_active, is_admin: editData.is_admin },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      setEditUserId(null);
    } catch (e) {
      alert("Failed to update user");
    }
  }

  async function deleteUser(userId) {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (e) {
      alert("Failed to delete user");
    }
  }

  return (
    <div className="max-w-5xl mx-auto mt-24 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center">User Management</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-purple-600 text-white">
              <th className="border border-gray-300 px-4 py-2">Email</th>
              <th className="border border-gray-300 px-4 py-2">Active</th>
              <th className="border border-gray-300 px-4 py-2">Admin</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No users found.
                </td>
              </tr>
            )}
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {editUserId === user.id ? (
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={editData.is_active}
                      onChange={handleChange}
                    />
                  ) : user.is_active ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center">
                  {editUserId === user.id ? (
                    <input
                      type="checkbox"
                      name="is_admin"
                      checked={editData.is_admin}
                      onChange={handleChange}
                    />
                  ) : user.is_admin ? (
                    "Yes"
                  ) : (
                    "No"
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                  {editUserId === user.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(user.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(user)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
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
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          disabled={users.length < pagination.limit}
          onClick={() => setPagination((p) => ({ ...p, skip: p.skip + p.limit }))}
          className="bg-purple-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
