import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminPageLayout from './AdminPageLayout';

const statusOptions = ['', 'assigned', 'pickedup', 'delivered'];

const AdminDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: token }), [token]);

  const loadDeliveries = async (status = statusFilter) => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/deliveries', {
        headers,
        params: status ? { status } : {},
      });
      setDeliveries(response.data.deliveries || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load deliveries.');
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

    loadDeliveries('');
  }, [token]);

  return (
    <AdminPageLayout
      title="Track Deliveries"
      subtitle="Monitor assigned, picked-up, and delivered orders from one place."
      actions={
        <select
          value={statusFilter}
          onChange={(event) => {
            const nextStatus = event.target.value;
            setStatusFilter(nextStatus);
            setLoading(true);
            loadDeliveries(nextStatus);
          }}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
        >
          {statusOptions.map((status) => (
            <option key={status || 'all'} value={status}>{status ? status : 'All statuses'}</option>
          ))}
        </select>
      }
    >
      {error ? (
        <div className="rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
      ) : (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <p className="text-sm text-slate-500">Loading deliveries...</p>
          ) : deliveries.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">No deliveries available.</p>
          ) : (
            <div className="space-y-4">
              {deliveries.map((delivery) => (
                <article key={delivery._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{delivery.donation?.title || 'Donation'}</h3>
                      <p className="mt-1 text-sm text-slate-600">Status: {delivery.status}</p>
                      <p className="mt-1 text-sm text-slate-600">Donor: {delivery.donation?.donor?.name || 'N/A'}</p>
                      <p className="mt-1 text-sm text-slate-600">NGO: {delivery.donation?.acceptedBy?.name || 'N/A'}</p>
                    </div>
                    <div className="text-sm text-slate-600">
                      <p><span className="font-semibold text-slate-900">Delivery partner:</span> {delivery.deliveryPerson?.name || 'N/A'}</p>
                      <p><span className="font-semibold text-slate-900">Phone:</span> {delivery.deliveryPerson?.phone || 'N/A'}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminDeliveries;
