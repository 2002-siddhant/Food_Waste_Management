import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import AdminPageLayout from './AdminPageLayout';

const AdminAssignDeliveries = () => {
  const [donations, setDonations] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [assignment, setAssignment] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const token = localStorage.getItem('token');
  const headers = useMemo(() => ({ Authorization: token }), [token]);

  const loadData = async () => {
    try {
      const [donationsResponse, partnersResponse] = await Promise.all([
        axios.get('http://localhost:3000/api/admin/donations', { headers, params: { status: 'available,accepted,assigned' } }),
        axios.get('http://localhost:3000/api/admin/delivery-partners', { headers }),
      ]);
      setDonations((donationsResponse.data.donations || []).filter((donation) => ['available', 'accepted', 'assigned'].includes(donation.status)));
      setDeliveryPartners(partnersResponse.data.deliveryPartners || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load delivery assignment data.');
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

    loadData();
  }, [token]);

  const handleAssign = async (donationId) => {
    const deliveryPartnerId = assignment[donationId];
    if (!deliveryPartnerId) {
      setError('Please select a delivery partner first.');
      return;
    }

    setActionLoading(donationId);
    try {
      const response = await axios.patch(
        `http://localhost:3000/api/admin/donations/${donationId}/assign-delivery`,
        { deliveryPartnerId },
        { headers }
      );
      setDonations((current) => current.map((donation) => donation._id === donationId ? response.data.donation : donation));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to assign delivery partner.');
    } finally {
      setActionLoading('');
    }
  };

  return (
    <AdminPageLayout
      title="Assign Deliveries"
      subtitle="Show accepted donations and assign delivery partners quickly."
    >
      {error ? (
        <div className="rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
      ) : (
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900">Donations ready for dispatch</h2>
            <p className="mt-1 text-sm text-slate-500">{donations.length} eligible donation(s)</p>
          </div>

          {loading ? (
            <p className="text-sm text-slate-500">Loading assignment queue...</p>
          ) : donations.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">No eligible donations require assignment yet.</p>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <article key={donation._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{donation.title}</h3>
                      <p className="mt-1 text-sm text-slate-600">
                        {donation.foodcategory} · {donation.donationtype} · {donation.quantity} {donation.quantityUnit}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">NGO: {donation.acceptedBy?.name || 'N/A'}</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <select
                        value={assignment[donation._id] || donation.deliveryPartner?._id || ''}
                        onChange={(event) =>
                          setAssignment((current) => ({ ...current, [donation._id]: event.target.value }))
                        }
                        className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
                      >
                        <option value="">Select delivery partner</option>
                        {deliveryPartners.map((partner) => (
                          <option key={partner._id} value={partner._id}>
                            {partner.name} · {partner.phone} · workload {partner.activeDeliveries || 0}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleAssign(donation._id)}
                        disabled={actionLoading === donation._id}
                        className="rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                      >
                        {actionLoading === donation._id ? 'Assigning...' : 'Assign'}
                      </button>
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

export default AdminAssignDeliveries;
