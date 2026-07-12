import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const Deliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = localStorage.getItem('token');
    const headers = useMemo(() => ({ Authorization: token }), [token]);

    useEffect(() => {
        if (!token) {
            setError('Please log in as a delivery partner.');
            setLoading(false);
            return;
        }

        const loadDeliveries = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/donation/delivery/assigned', { headers });
                setDeliveries(response.data.deliveries || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load deliveries history.');
            } finally {
                setLoading(false);
            }
        };

        loadDeliveries();
    }, [token]);

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Delivery History</p>
                    <h1 className="mt-3 text-3xl font-semibold">Your delivery progress</h1>
                    <p className="mt-2 text-sm text-slate-300">Track all assignments you have received and their current status.</p>
                </header>

                {error ? (
                    <div className="mt-6 rounded-3xl bg-white p-6 text-rose-700 shadow-sm ring-1 ring-slate-200">{error}</div>
                ) : null}

                <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    {loading ? (
                        <p className="text-sm text-slate-500">Loading delivery history...</p>
                    ) : deliveries.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                            No delivery history found.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {deliveries.map((delivery) => (
                                <article key={delivery._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                        <div>
                                            <h2 className="text-lg font-semibold text-slate-900">{delivery.donation?.title || 'Donation'}</h2>
                                            <p className="mt-1 text-sm text-slate-600">Status: {delivery.status}</p>
                                            <p className="mt-1 text-sm text-slate-600">Pickup: {delivery.donation?.pickupLocation || 'N/A'}</p>
                                            <div className="mt-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                                <p className="text-sm font-semibold text-slate-900">Donor details</p>
                                                <p className="mt-1 text-sm text-slate-600">Name: {delivery.donation?.donor?.name || 'N/A'}</p>
                                                <p className="mt-1 text-sm text-slate-600">Phone: {delivery.donation?.donor?.phone || 'N/A'}</p>
                                                <p className="mt-1 text-sm text-slate-600">Email: {delivery.donation?.donor?.email || 'N/A'}</p>
                                                <p className="mt-1 text-sm text-slate-600">Address: {delivery.donation?.donor?.address || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            <p><span className="font-semibold text-slate-900">NGO:</span> {delivery.donation?.acceptedBy?.name || 'N/A'}</p>
                                            <p><span className="font-semibold text-slate-900">Assigned by:</span> {delivery.assignedby?.name || 'N/A'}</p>
                                        </div>
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

export default Deliveries;