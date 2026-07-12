import React, { useState, useEffect } from "react";
import axios from 'axios';
import { NavLink } from "react-router-dom";

const Items = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [acceptingId, setAcceptingId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            setError("Sorry! You are not logged in.");
            return;
        }

        const fetchdonations = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/donation/alldonations', {
                    headers: {
                        Authorization: token,
                    },
                });
                setDonations(response.data.donations || []);
            } catch (err) {
                setError(err.response?.data?.message || "Unable to load items.");
            } finally {
                setLoading(false);
            }
        };

        fetchdonations();
    }, []);

    const statusClasses = (s) => {
        switch (s) {
            case "available":
                return "bg-emerald-100 text-emerald-800";
            case "accepted":
                return "bg-sky-100 text-sky-800";
            case "assigned":
                return "bg-violet-100 text-violet-800";
            case "pickedup":
                return "bg-indigo-100 text-indigo-800";
            case "delivered":
                return "bg-emerald-600 text-white";
            case "rejected":
                return "bg-rose-100 text-rose-800";
            default:
                return "bg-amber-100 text-amber-800";
        }
    };

    const handleAccept = async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Sorry! You are not logged in.");
            return;
        }

        setAcceptingId(id);
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/donation/${id}/accept`,
                {},
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            setDonations((currentDonations) =>
                currentDonations.map((donation) =>
                    donation._id === id ? response.data.donation : donation
                )
            );
        } catch (err) {
            alert(err.response?.data?.message || "Unable to accept donation.");
        } finally {
            setAcceptingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-800 to-cyan-900 p-6">
                <div className="rounded-3xl bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
                    <img src="/favicon.svg" alt="logo" className="mx-auto h-20 w-20 opacity-90" />
                    <p className="mt-4 text-lg font-semibold text-cyan-100">Loading available items...</p>
                    <p className="mt-2 text-sm text-slate-300">Getting the latest donations near you.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
                <div className="max-w-lg rounded-2xl bg-white p-6 shadow">
                    <h2 className="text-xl font-bold text-rose-600">Error</h2>
                    <p className="mt-2 text-sm text-slate-700">{error}</p>
                    <div className="mt-4">
                        <NavLink to="/login" className="inline-flex rounded-full bg-emerald-600 px-4 py-2 text-white">Sign in</NavLink>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <header className="mb-8 flex items-center justify-between rounded-[28px] bg-white p-6 shadow-lg">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Available Items</h1>
                        <p className="mt-1 text-sm text-slate-500">Browse donations that anyone can pick up.</p>
                    </div>
                    <img src="/favicon.svg" alt="donation" className="h-14 w-14 rounded-lg" />
                </header>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {donations.map((d) => (
                        <article key={d._id} className="group overflow-hidden rounded-2xl bg-white shadow hover:shadow-lg transition">
                            <div className="relative overflow-hidden bg-linear-to-br from-emerald-50 to-cyan-50 p-4">
                                <img src="/favicon.svg" alt="item" className="absolute right-4 top-4 h-16 w-16 opacity-20" />
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">{d.title}</h2>
                                        <p className="mt-1 text-sm text-slate-600">{d.foodcategory} · {d.donationtype}</p>
                                    </div>
                                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${statusClasses(d.status)}`}>
                                        {d.status ?? 'pending'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="mb-3 grid gap-3 sm:grid-cols-2">
                                    <div className="rounded-lg border border-slate-100 p-3">
                                        <p className="text-xs text-slate-500">Quantity</p>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">{d.quantity} {d.quantityUnit}</p>
                                    </div>
                                    <div className="rounded-lg border border-slate-100 p-3">
                                        <p className="text-xs text-slate-500">Pickup</p>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">{d.pickupLocation}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-3">
                                    <div className="text-sm text-slate-500">Available till: <span className="text-slate-700 font-medium">{new Date(d.availableTill).toLocaleString()}</span></div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {(d.status === "pending" || d.status === "available") && (
                                            <button
                                                type="button"
                                                onClick={() => handleAccept(d._id)}
                                                disabled={acceptingId === d._id}
                                                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                                            >
                                                {acceptingId === d._id ? "Accepting..." : "Accept"}
                                            </button>
                                        )}
                                        <NavLink to={`/donation/${d._id}`} className="inline-flex items-center gap-2 rounded-full bg-cyan-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-cyan-700">
                                            View
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Items;
