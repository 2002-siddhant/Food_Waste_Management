import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminPageLayout from './AdminPageLayout';

const statusOptions = ['', 'available', 'accepted', 'assigned', 'pickedup', 'delivered', 'rejected'];

const badgeClass = (status) => {
  const classes = {
    available: 'bg-emerald-100 text-emerald-800',
    accepted: 'bg-sky-100 text-sky-800',
    assigned: 'bg-violet-100 text-violet-800',
    pickedup: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-emerald-600 text-white',
    rejected: 'bg-rose-100 text-rose-800',
    pending: 'bg-amber-100 text-amber-800',
  };
  return classes[status] || 'bg-slate-100 text-slate-800';
};

const AdminDonations = () => {
  const [donations, setDonations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: token }), [token]);

  const loadDonations = async (status = statusFilter) => {
    try {
      const response = await axios.get('http://localhost:3000/api/admin/donations', {
        headers,
        params: status ? { status } : {},
      });
      setDonations(response.data.donations || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load donations.');
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

    loadDonations('');
  }, [token]);

  const handleReject = async (donationId) => {
    setActionLoading(donationId);
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/admin/donations/${donationId}/reject`,
        {},
        { headers }
      );
      setDonations((current) => current.map((donation) => donation._id === donationId ? response.data.donation : donation));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reject donation.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <AdminPageLayout
      title="Manage Donations"
      subtitle="Review all donation requests, filter by status, and reject invalid entries."
      actions={
        <select
          value={statusFilter}
          onChange={(event) => {
            const nextStatus = event.target.value;
            setStatusFilter(nextStatus);
            setLoading(true);
            loadDonations(nextStatus);
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
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Donation list</h2>
              <p className="mt-1 text-sm text-slate-500">{donations.length} donation(s) found</p>
            </div>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading donations...</p>
          ) : donations.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">No donations found.</p>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <article key={donation._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-slate-900">{donation.title}</h3>
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeClass(donation.status)}`}>
                          {donation.status}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {donation.foodcategory} · {donation.donationtype} · {donation.quantity} {donation.quantityUnit}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">Pickup: {donation.pickupLocation}</p>
                      <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                        <p><span className="font-semibold text-slate-900">Donor:</span> {donation.donor?.name || 'N/A'}</p>
                        <p><span className="font-semibold text-slate-900">NGO:</span> {donation.acceptedBy?.name || 'Not accepted'}</p>
                        <p><span className="font-semibold text-slate-900">Delivery:</span> {donation.deliveryPartner?.name || 'Not assigned'}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleReject(donation._id)}
                      disabled={donation.status === 'delivered' || donation.status === 'rejected' || actionLoading === donation._id}
                      className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
                    >
                      {actionLoading === donation._id ? 'Working...' : 'Reject Donation'}
                    </button>
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

export default AdminDonations;
