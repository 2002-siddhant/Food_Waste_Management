import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminPageLayout from './AdminPageLayout';

const AdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: token }), [token]);

  useEffect(() => {
    if (!token) {
      setError('Please log in as admin to view this page.');
      setLoading(false);
      return;
    }

    const loadNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/notifications', { headers });
        setNotifications(response.data.notifications || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load notifications.');
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [token]);

  return (
    <AdminPageLayout
      title="Notifications"
      subtitle="See system activity and admin-relevant notification history."
    >
      {error ? (
        <div className="rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
      ) : (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <p className="text-sm text-slate-500">Loading notifications...</p>
          ) : notifications.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">No notifications yet.</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((item) => (
                <div key={item._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">{item.message || 'System activity'}</p>
                  <p className="mt-1 text-sm text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminNotifications;
