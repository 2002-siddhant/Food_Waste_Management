import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminPageLayout from './AdminPageLayout';

const AdminRejectedDonations = () => {
  const [donations, setDonations] = useState([]);
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

    const loadRejected = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/donations', {
          headers,
          params: { status: 'rejected' },
        });
        setDonations(response.data.donations || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load rejected donations.');
      } finally {
        setLoading(false);
      }
    };

    loadRejected();
  }, [token]);

  return (
    <AdminPageLayout
      title="Rejected Donations"
      subtitle="Keep track of donations that were rejected or marked invalid."
    >
      {error ? (
        <div className="rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
      ) : (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <p className="text-sm text-slate-500">Loading rejected donations...</p>
          ) : donations.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">No rejected donations found.</p>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <article key={donation._id} className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{donation.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{donation.foodcategory} · {donation.donationtype}</p>
                  <p className="mt-1 text-sm text-slate-600">Donor: {donation.donor?.name || 'N/A'}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminRejectedDonations;
