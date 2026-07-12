import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const Requested = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("You must be logged in to view requested donations.");
            setLoading(false);
            return;
        }

        const fetchRequestedDonations = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/donation/requested", {
                    headers: {
                        Authorization: token,
                    },
                });
                setDonations(response.data.donations || []);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load requested donations.");
            } finally {
                setLoading(false);
            }
        };

        fetchRequestedDonations();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
                    <p className="text-xl font-semibold text-slate-900">Loading requested donations...</p>
                    <p className="mt-2 text-sm text-slate-500">Fetching the food donations accepted by your NGO.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <div className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-lg">
                    <h2 className="text-2xl font-semibold text-rose-700">Unable to load requested donations</h2>
                    <p className="mt-3 text-slate-600">{error}</p>
                    <NavLink to="/items" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                        Back to Items
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Requested Items</p>
                    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold">Accepted donations for your NGO</h1>
                            <p className="mt-2 text-sm text-slate-300">These donations have been accepted and are ready for the next pickup workflow.</p>
                        </div>
                        <div className="rounded-2xl bg-white/10 px-5 py-3">
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Total</p>
                            <p className="mt-1 text-2xl font-semibold">{donations.length}</p>
                        </div>
                    </div>
                </header>

                {donations.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-900">No requested donations yet</h2>
                        <p className="mt-3 text-slate-500">Accept donations from the available items page and they will appear here.</p>
                        <NavLink to="/items" className="mt-6 inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
                            Browse Items
                        </NavLink>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {donations.map((donation) => (
                            <article key={donation._id} className="overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-slate-200">
                                <div className="bg-emerald-600 px-6 py-5 text-white">
                                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="text-xs uppercase tracking-[0.3em] text-emerald-100">Accepted Donation</p>
                                            <h2 className="mt-2 text-2xl font-semibold">{donation.title}</h2>
                                        </div>
                                        <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-emerald-700">
                                            {donation.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="grid gap-5 p-6 lg:grid-cols-[1fr_0.8fr]">
                                    <section className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                            <p className="text-sm text-slate-500">Category</p>
                                            <p className="mt-2 font-semibold text-slate-900">{donation.foodcategory}</p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                            <p className="text-sm text-slate-500">Type</p>
                                            <p className="mt-2 font-semibold text-slate-900">{donation.donationtype}</p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                            <p className="text-sm text-slate-500">Quantity</p>
                                            <p className="mt-2 font-semibold text-slate-900">{donation.quantity} {donation.quantityUnit}</p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                            <p className="text-sm text-slate-500">Available Till</p>
                                            <p className="mt-2 font-semibold text-slate-900">{new Date(donation.availableTill).toLocaleString()}</p>
                                        </div>
                                        <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 sm:col-span-2">
                                            <p className="text-sm text-slate-500">Pickup Location</p>
                                            <p className="mt-2 font-semibold text-slate-900">{donation.pickupLocation}</p>
                                        </div>
                                    </section>

                                    <section className="rounded-2xl bg-slate-950 p-5 text-white">
                                        <h3 className="text-lg font-semibold">Donor Details</h3>
                                        <div className="mt-4 space-y-3 text-sm text-slate-300">
                                            <p><span className="font-semibold text-white">Name:</span> {donation.donor?.name || "N/A"}</p>
                                            <p><span className="font-semibold text-white">Email:</span> {donation.donor?.email || "N/A"}</p>
                                            <p><span className="font-semibold text-white">Phone:</span> {donation.donor?.phone || "N/A"}</p>
                                            <p><span className="font-semibold text-white">Address:</span> {donation.donor?.address || "N/A"}</p>
                                        </div>
                                        <NavLink to={`/donation/${donation._id}`} className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200">
                                            View Details
                                        </NavLink>
                                    </section>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requested;
