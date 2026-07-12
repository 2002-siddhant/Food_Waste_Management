import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const Donations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to view your donations.');
            setLoading(false);
            return;
        }

        const fetchDonations = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/donation/mydonations', {
                    headers: {
                        Authorization: token,
                    },
                });
                setDonations(response.data.donations || []);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load donations.');
            } finally {
                setLoading(false);
            }
        };

        fetchDonations();
    }, []);

    const renderStatusBadge = (status) => {
        const normalized = status || 'pending';
        const statusMap = {
            pending: 'bg-amber-100 text-amber-700',
            available: 'bg-emerald-100 text-emerald-700',
            accepted: 'bg-sky-100 text-sky-700',
            assigned: 'bg-violet-100 text-violet-700',
            pickedup: 'bg-indigo-100 text-indigo-700',
            delivered: 'bg-emerald-600 text-white',
            rejected: 'bg-rose-100 text-rose-700',
        };
        return statusMap[normalized] || 'bg-slate-100 text-slate-700';
    };

    const isDonationExpired = (availableTill) => {
        if (!availableTill) return false;

        const expiryDate = new Date(availableTill);
        if (Number.isNaN(expiryDate.getTime())) return false;

        const currentDay = new Date();
        currentDay.setHours(0, 0, 0, 0);

        const expiryDay = new Date(expiryDate);
        expiryDay.setHours(0, 0, 0, 0);

        return expiryDay < currentDay;
    };

    const activeDonations = (donations || []).filter((donation) => {
        const status = (donation.status || 'pending').toLowerCase();
        const isActiveStatus = ['pending', 'available', 'accepted', 'assigned', 'pickedup'].includes(status);
        const isExpired = isDonationExpired(donation.availableTill);
        const isRejectedOrDelivered = status === 'rejected' || status === 'delivered';
        return isActiveStatus && !isExpired && !isRejectedOrDelivered;
    });

    if (loading) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-linear-to-br from-slate-900 via-slate-950 to-cyan-950 px-4'>
                <div className='rounded-32px bg-slate-900/95 px-10 py-8 text-center shadow-2xl shadow-cyan-500/10'>
                    <p className='text-xl font-semibold text-cyan-200'>Loading donations...</p>
                    <p className='mt-2 text-sm text-slate-400'>Fetching your latest donation records now.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-slate-900 via-slate-950 to-rose-950 px-4 text-center'>
                <div className='max-w-xl rounded-32px border border-rose-300/30 bg-rose-50/95 p-8 shadow-xl shadow-rose-500/10'>
                    <h2 className='text-3xl font-bold text-rose-700'>Oops!</h2>
                    <p className='mt-3 text-slate-700'>{error}</p>
                    <NavLink
                        to='/login'
                        className='mt-6 inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800'
                    >
                        Log in to continue
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-6xl'>
                <div className='mb-8 overflow-hidden rounded-32px bg-linear-to-br from-emerald-500 via-cyan-500 to-slate-900 p-8 text-white shadow-2xl shadow-cyan-500/20 ring-1 ring-white/10'>
                    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                        <div className='space-y-3'>
                            <p className='text-sm uppercase tracking-[0.35em] text-cyan-100/80'>Active Donations</p>
                            <h1 className='text-4xl font-bold tracking-tight'>Live donations that are still open.</h1>
                            <p className='max-w-2xl text-sm leading-6 text-cyan-100/80'>These are donations that are not expired, not delivered, and not rejected yet.</p>
                        </div>
                        <div className='inline-flex items-center gap-4 rounded-[28px] bg-white/10 px-5 py-4 backdrop-blur-sm'>
                            <div className='rounded-2xl bg-white/15 p-3 text-cyan-100 shadow-inner shadow-white/10'>
                                <span className='text-2xl'>📦</span>
                            </div>
                            <div>
                                <p className='text-xs uppercase tracking-[0.3em] text-cyan-100/70'>Active count</p>
                                <p className='text-3xl font-semibold'>{activeDonations.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
                        <div className='rounded-3xl bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur-sm'>
                            <p className='text-sm text-cyan-100/80'>Fastest action</p>
                            <p className='mt-3 text-2xl font-semibold'>Instant publishing</p>
                        </div>
                        <div className='rounded-3xl bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur-sm'>
                            <p className='text-sm text-cyan-100/80'>Safety first</p>
                            <p className='mt-3 text-2xl font-semibold'>Verified pickup details</p>
                        </div>
                        <div className='rounded-3xl bg-white/10 p-5 ring-1 ring-white/10 backdrop-blur-sm'>
                            <p className='text-sm text-cyan-100/80'>Green impact</p>
                            <p className='mt-3 text-2xl font-semibold'>Food saved from waste</p>
                        </div>
                    </div>
                </div>

                {activeDonations.length === 0 ? (
                    <div className='rounded-32px border border-dashed border-slate-300 bg-white p-10 text-center shadow-lg shadow-slate-200/40'>
                        <p className='text-2xl font-semibold text-slate-900'>No active donations right now</p>
                        <p className='mt-3 text-slate-500'>Your current active donations will appear here until they are delivered, expired, or rejected.</p>
                        <NavLink
                            to='/adddonation'
                            className='mt-6 inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-700'
                        >
                            Add a Donation
                        </NavLink>
                    </div>
                ) : (
                    <div className='grid gap-6'>
                        {activeDonations.map((donation) => (
                            <article
                                key={donation._id}
                                className='group overflow-hidden rounded-32px border border-slate-200 bg-white shadow-[0_24px_80px_-35px_rgba(15,23,42,0.35)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_100px_-40px_rgba(15,23,42,0.35)]'
                            >
                                <div className='bg-slate-950/95 px-6 py-6 text-white'>
                                    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                                        <div>
                                            <p className='text-xs uppercase tracking-[0.35em] text-slate-400'>Donation ID</p>
                                            <p className='mt-2 text-sm text-slate-300'>{donation._id}</p>
                                            <h2 className='mt-4 text-3xl font-semibold tracking-tight'>{donation.title}</h2>
                                            <div className='mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300'>
                                                <span className='inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-2'>
                                                    <span>🍲</span>
                                                    {donation.donationtype === 'raw' ? 'Raw' : 'Cooked'}
                                                </span>
                                                <span className='inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-2'>
                                                    <span>🥗</span>
                                                    {donation.foodcategory}
                                                </span>
                                            </div>
                                        </div>
                                        <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${renderStatusBadge(donation.status)}`}>
                                            {donation.status ?? 'pending'}
                                        </span>
                                    </div>
                                </div>
                                <div className='px-6 pb-6 pt-8'>
                                    <div className='grid gap-4 md:grid-cols-3'>
                                        <div className='rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition group-hover:bg-emerald-50'>
                                            <p className='text-sm text-slate-500'>Quantity</p>
                                            <p className='mt-3 text-xl font-semibold text-slate-900'>
                                                {donation.quantity} {donation.quantityUnit}
                                            </p>
                                        </div>
                                        <div className='rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition group-hover:bg-cyan-50'>
                                            <p className='text-sm text-slate-500'>Pickup Location</p>
                                            <p className='mt-3 text-xl font-semibold text-slate-900'>{donation.pickupLocation}</p>
                                        </div>
                                        <div className='rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition group-hover:bg-amber-50'>
                                            <p className='text-sm text-slate-500'>Available Till</p>
                                            <p className='mt-3 text-xl font-semibold text-slate-900'>
                                                {new Date(donation.availableTill).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className='mt-6 flex flex-wrap items-center justify-between gap-3'>
                                        <NavLink
                                            to={`/mydonation/${donation._id}`}
                                            className='inline-flex rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700'
                                        >
                                            View details
                                        </NavLink>
                                    </div>

                                    <div className='mt-6 grid gap-4 sm:grid-cols-2'>
                                        {donation.expiryDate && (
                                            <div className='rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition group-hover:bg-rose-50'>
                                                <p className='text-sm text-slate-500'>Expiry Date</p>
                                                <p className='mt-3 text-lg font-semibold text-slate-900'>
                                                    {new Date(donation.expiryDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                        {donation.cookedAt && (
                                            <div className='rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition group-hover:bg-violet-50'>
                                                <p className='text-sm text-slate-500'>Cooked At</p>
                                                <p className='mt-3 text-lg font-semibold text-slate-900'>
                                                    {new Date(donation.cookedAt).toLocaleString()}
                                                </p>
                                            </div>
                                        )}
                                        {donation.vegType && (
                                            <div className='rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition group-hover:bg-slate-100'>
                                                <p className='text-sm text-slate-500'>Food Type</p>
                                                <p className='mt-3 text-lg font-semibold text-slate-900'>{donation.vegType}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Donations;