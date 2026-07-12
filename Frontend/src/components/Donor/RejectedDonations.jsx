import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const RejectedDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view rejected donations.');
      setLoading(false);
      return;
    }

    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/donation/mydonations', {
          headers: { Authorization: token },
        });
        setDonations((response.data.donations || []).filter((donation) => donation.status === 'rejected'));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load rejected donations.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-rose-300">Rejected Donations</p>
          <h1 className="mt-3 text-3xl font-semibold">Items that were rejected</h1>
          <p className="mt-2 text-sm text-slate-300">See the reason each donation was rejected and review the details.</p>
        </header>

        {error ? (
          <div className="mt-6 rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
        ) : null}

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <p className="text-sm text-slate-500">Loading rejected donations...</p>
          ) : donations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              No rejected donations found yet.
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <article key={donation._id} className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{donation.title}</h2>
                      <p className="mt-1 text-sm text-slate-600">{donation.foodcategory} · {donation.donationtype}</p>
                      <p className="mt-1 text-sm text-rose-700">Reason: {donation.rejectionReason || 'No reason provided'}</p>
                    </div>
                    <NavLink to={`/mydonation/${donation._id}`} className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white">
                      View Details
                    </NavLink>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RejectedDonations;
