import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const PastDonations = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view your donation history.');
      setLoading(false);
      return;
    }

    const fetchDonations = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/donation/mydonations', {
          headers: { Authorization: token },
        });
        const past = (response.data.donations || []).filter((donation) => {
          const status = (donation.status || '').toLowerCase();
          return status === 'delivered';
        });
        setDonations(past);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load donation history.');
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
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Past Accepted Donations</p>
          <h1 className="mt-3 text-3xl font-semibold">Delivered donations</h1>
          <p className="mt-2 text-sm text-slate-300">Review completed donations that were successfully delivered.</p>
        </header>

        {error ? (
          <div className="mt-6 rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
        ) : null}

        <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          {loading ? (
            <p className="text-sm text-slate-500">Loading donation history...</p>
          ) : donations.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
              No past accepted donations found yet.
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <article key={donation._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{donation.title}</h2>
                      <p className="mt-1 text-sm text-slate-600">{donation.foodcategory} · {donation.donationtype}</p>
                      <p className="mt-1 text-sm text-slate-600">Status: {donation.status}</p>
                      {donation.rejectionReason ? (
                        <p className="mt-1 text-sm text-rose-700">Reason: {donation.rejectionReason}</p>
                      ) : null}
                    </div>
                    <NavLink to={`/mydonation/${donation._id}`} className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
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

export default PastDonations;
