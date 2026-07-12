import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminPageLayout from './AdminPageLayout';

const roleOptions = ['', 'donor', 'ngos', 'delivery', 'admin'];

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: token }), [token]);

  const loadUsers = async (role = roleFilter) => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/users', {
        headers,
        params: role ? { role } : {},
      });
      setUsers(response.data.users || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError('Please log in as admin to view this page.');
      setLoading(false);
      return;
    }

    loadUsers('');
  }, [token]);

  return (
    <AdminPageLayout
      title="Manage Users"
      subtitle="View and filter donors, NGOs, delivery partners, and admins from one place."
      actions={
        <select
          value={roleFilter}
          onChange={(event) => {
            const nextRole = event.target.value;
            setRoleFilter(nextRole);
            setLoading(true);
            loadUsers(nextRole);
          }}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
        >
          {roleOptions.map((role) => (
            <option key={role || 'all'} value={role}>{role ? role : 'All roles'}</option>
          ))}
        </select>
      }
    >
      {error ? (
        <div className="rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
      ) : (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Platform users</h2>
              <p className="mt-1 text-sm text-slate-500">{users.length} user(s) listed</p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">No users found for this filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-950 text-white">
                  <tr>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-slate-100">
                      <td className="px-4 py-3 font-semibold text-slate-900">{user.name}</td>
                      <td className="px-4 py-3 capitalize text-slate-600">{user.role}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                      <td className="px-4 py-3 text-slate-600">{user.address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminUsers;
