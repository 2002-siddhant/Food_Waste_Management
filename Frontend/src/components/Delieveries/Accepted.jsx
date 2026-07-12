import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const Accepted = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState('');

    const token = localStorage.getItem('token');
    const headers = useMemo(() => ({ Authorization: token }), [token]);

    const loadDeliveries = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/donation/delivery/assigned', { headers });
            setDeliveries(response.data.deliveries || []);
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to load assigned deliveries.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            setError('Please log in as a delivery partner.');
            setLoading(false);
            return;
        }

        loadDeliveries();
    }, [token]);

    const updateStatus = async (deliveryId, status) => {
        setActionLoading(deliveryId);
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/donation/delivery/${deliveryId}/status`,
                { status },
                { headers }
            );
            setDeliveries((current) =>
                current.map((delivery) => (delivery._id === deliveryId ? response.data.delivery : delivery))
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Unable to update delivery status.');
        } finally {
            setActionLoading('');
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Accepted Deliveries</p>
                    <h1 className="mt-3 text-3xl font-semibold">Your assigned delivery tasks</h1>
                    <p className="mt-2 text-sm text-slate-300">Accept and update the status of donations assigned to you.</p>
                </header>

                {error ? (
                    <div className="mt-6 rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
                ) : null}

                <div className="mt-6 grid gap-6">
                    {loading ? (
                        <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">Loading deliveries...</div>
                    ) : deliveries.length === 0 ? (
                        <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-xl font-semibold text-slate-900">No deliveries assigned yet</h2>
                            <p className="mt-2 text-sm text-slate-500">New assignments from admins will appear here.</p>
                        </div>
                    ) : deliveries.map((delivery) => {
                        const donation = delivery.donation;
                        const canPickup = delivery.status === 'assigned';
                        const canDeliver = delivery.status === 'pickedup';

                        return (
                            <article key={delivery._id} className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="text-xl font-semibold text-slate-900">{donation?.title || 'Donation'}</h2>
                                            <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-800">{delivery.status}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">{donation?.foodcategory} · {donation?.donationtype} · {donation?.quantity} {donation?.quantityUnit}</p>
                                        <p className="mt-1 text-sm text-slate-600">Pickup: {donation?.pickupLocation}</p>
                                        <div className="mt-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                            <p className="text-sm font-semibold text-slate-900">Donor details</p>
                                            <p className="mt-1 text-sm text-slate-600">Name: {donation?.donor?.name || 'N/A'}</p>
                                            <p className="mt-1 text-sm text-slate-600">Phone: {donation?.donor?.phone || 'N/A'}</p>
                                            <p className="mt-1 text-sm text-slate-600">Email: {donation?.donor?.email || 'N/A'}</p>
                                            <p className="mt-1 text-sm text-slate-600">Address: {donation?.donor?.address || 'N/A'}</p>
                                        </div>
                                        <p className="mt-3 text-sm text-slate-600">NGO: {donation?.acceptedBy?.name || 'N/A'}</p>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row">
                                        <button
                                            type="button"
                                            onClick={() => updateStatus(delivery._id, 'pickedup')}
                                            disabled={!canPickup || actionLoading === delivery._id}
                                            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                                        >
                                            {actionLoading === delivery._id ? 'Updating...' : 'Mark Picked Up'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => updateStatus(delivery._id, 'delivered')}
                                            disabled={!canDeliver || actionLoading === delivery._id}
                                            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                                        >
                                            {actionLoading === delivery._id ? 'Updating...' : 'Mark Delivered'}
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Accepted;