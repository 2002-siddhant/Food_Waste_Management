import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminPageLayout from './AdminPageLayout';

const AdminReports = () => {
  const [reports, setReports] = useState(null);
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

    const loadReports = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/admin/reports', { headers });
        setReports(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load reports.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [token]);

  return (
    <AdminPageLayout
      title="Reports"
      subtitle="Gain insight into donations, volume, and the most active participants."
    >
      {error ? (
        <div className="rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
      ) : (
        <div className="grid gap-6">
          {loading ? (
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">Loading reports...</div>
          ) : (
            <>
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Total food quantity donated</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {(reports?.quantityByType || []).map((item) => (
                    <div key={item._id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-sm text-slate-500">{item._id}</p>
                      <p className="mt-2 text-2xl font-semibold text-slate-900">{item.totalQuantity}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Donations by category</h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {(reports?.donationsByCategory || []).map((item) => (
                    <div key={item._id} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <p className="text-sm text-slate-500">{item._id}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-900">{item.count} donation(s) · {item.totalQuantity} qty</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Most active donors</h2>
                <div className="mt-4 space-y-3">
                  {(reports?.topDonors || []).map((donor) => (
                    <div key={donor._id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div>
                        <p className="font-semibold text-slate-900">{donor.name}</p>
                        <p className="text-sm text-slate-500">{donor.email}</p>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-800">{donor.count} donations</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">Most active NGOs</h2>
                <div className="mt-4 space-y-3">
                  {(reports?.topNgos || []).map((ngo) => (
                    <div key={ngo._id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div>
                        <p className="font-semibold text-slate-900">{ngo.name}</p>
                        <p className="text-sm text-slate-500">{ngo.email}</p>
                      </div>
                      <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">{ngo.count} accepted</span>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminReports;
