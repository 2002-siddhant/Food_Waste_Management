import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink, useParams } from 'react-router-dom';

const DonationDetails = () => {
    const { id } = useParams();
    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to view this donation.');
            setLoading(false);
            return;
        }

        const fetchDonation = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/donation/${id}`, {
                    headers: {
                        Authorization: token,
                    },
                });
                setDonation(response.data.donation || null);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to load donation details.');
            } finally {
                setLoading(false);
            }
        };

        fetchDonation();
    }, [id]);

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

    if (loading) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-slate-100 px-4'>
                <div className='rounded-3xl bg-white p-8 text-center shadow-lg'>
                    <p className='text-xl font-semibold text-slate-900'>Loading donation details...</p>
                    <p className='mt-2 text-sm text-slate-500'>Please wait while we fetch the latest information.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-slate-100 px-4'>
                <div className='max-w-xl rounded-3xl bg-white p-8 text-center shadow-lg'>
                    <h2 className='text-2xl font-semibold text-rose-700'>Unable to load this donation</h2>
                    <p className='mt-3 text-slate-600'>{error}</p>
                    <NavLink to='/donations' className='mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white'>Back to donations</NavLink>
                </div>
            </div>
        );
    }

    if (!donation) {
        return null;
    }

    const isAccepted = donation.status === 'accepted';
    const isDelivered = donation.status === 'delivered';

    return (
        <div className='min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-6xl'>
                <div className='mb-6 flex flex-wrap items-center justify-between gap-3'>
                    <div>
                        <p className='text-sm uppercase tracking-[0.35em] text-slate-500'>Donation details</p>
                        <h1 className='text-3xl font-semibold text-slate-900'>{donation.title}</h1>
                    </div>
                    <NavLink to='/donations' className='inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/15'>Back to donations</NavLink>
                </div>

                <div className='overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_24px_80px_-35px_rgba(15,23,42,0.35)]'>
                    <div className='bg-slate-950 px-6 py-6 text-white'>
                        <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                            <div>
                                <p className='text-xs uppercase tracking-[0.35em] text-slate-400'>Donation ID</p>
                                <p className='mt-2 text-sm text-slate-300'>{donation._id}</p>
                            </div>
                            <span className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${renderStatusBadge(donation.status)}`}>
                                {donation.status || 'pending'}
                            </span>
                        </div>
                    </div>

                    <div className='grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]'>
                        <div className='space-y-6'>
                            <section className='rounded-3xl border border-slate-200 bg-slate-50 p-5'>
                                <h2 className='text-xl font-semibold text-slate-900'>Donation information</h2>
                                <div className='mt-4 grid gap-4 sm:grid-cols-2'>
                                    <div>
                                        <p className='text-sm text-slate-500'>Type</p>
                                        <p className='mt-1 font-semibold text-slate-900'>{donation.donationtype === 'raw' ? 'Raw food' : 'Cooked food'}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-slate-500'>Category</p>
                                        <p className='mt-1 font-semibold text-slate-900'>{donation.foodcategory}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-slate-500'>Quantity</p>
                                        <p className='mt-1 font-semibold text-slate-900'>{donation.quantity} {donation.quantityUnit}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-slate-500'>Pickup location</p>
                                        <p className='mt-1 font-semibold text-slate-900'>{donation.pickupLocation}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-slate-500'>Available till</p>
                                        <p className='mt-1 font-semibold text-slate-900'>{new Date(donation.availableTill).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className='text-sm text-slate-500'>Food type</p>
                                        <p className='mt-1 font-semibold text-slate-900'>{donation.vegType || 'Not specified'}</p>
                                    </div>
                                    {donation.expiryDate && (
                                        <div>
                                            <p className='text-sm text-slate-500'>Expiry date</p>
                                            <p className='mt-1 font-semibold text-slate-900'>{new Date(donation.expiryDate).toLocaleDateString()}</p>
                                        </div>
                                    )}
                                    {donation.cookedAt && (
                                        <div>
                                            <p className='text-sm text-slate-500'>Cooked at</p>
                                            <p className='mt-1 font-semibold text-slate-900'>{new Date(donation.cookedAt).toLocaleString()}</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            <section className='rounded-3xl border border-slate-200 bg-white p-5'>
                                <h2 className='text-xl font-semibold text-slate-900'>Donor details</h2>
                                <div className='mt-4 space-y-2 text-sm text-slate-600'>
                                    <p><span className='font-semibold text-slate-900'>Name:</span> {donation.donor?.name || 'N/A'}</p>
                                    <p><span className='font-semibold text-slate-900'>Email:</span> {donation.donor?.email || 'N/A'}</p>
                                    <p><span className='font-semibold text-slate-900'>Phone:</span> {donation.donor?.phone || 'N/A'}</p>
                                    <p><span className='font-semibold text-slate-900'>Address:</span> {donation.donor?.address || 'N/A'}</p>
                                </div>
                            </section>
                        </div>

                        <div className='space-y-6'>
                            {isAccepted && donation.acceptedBy && (
                                <section className='rounded-3xl border border-slate-200 bg-emerald-50 p-5'>
                                    <h2 className='text-xl font-semibold text-emerald-900'>Accepted by NGO</h2>
                                    <div className='mt-4 space-y-2 text-sm text-emerald-800'>
                                        <p><span className='font-semibold text-emerald-950'>Name:</span> {donation.acceptedBy.name}</p>
                                        <p><span className='font-semibold text-emerald-950'>Email:</span> {donation.acceptedBy.email}</p>
                                        <p><span className='font-semibold text-emerald-950'>Phone:</span> {donation.acceptedBy.phone}</p>
                                        <p><span className='font-semibold text-emerald-950'>Address:</span> {donation.acceptedBy.address}</p>
                                    </div>
                                </section>
                            )}

                            {isDelivered && donation.delivery && (
                                <section className='rounded-3xl border border-slate-200 bg-cyan-50 p-5'>
                                    <h2 className='text-xl font-semibold text-cyan-900'>Delivery details</h2>
                                    <div className='mt-4 space-y-2 text-sm text-cyan-800'>
                                        <p><span className='font-semibold text-cyan-950'>Status:</span> {donation.delivery.status}</p>
                                        <p><span className='font-semibold text-cyan-950'>Delivery person:</span> {donation.delivery.deliveryPerson?.name || 'N/A'}</p>
                                        <p><span className='font-semibold text-cyan-950'>Phone:</span> {donation.delivery.deliveryPerson?.phone || 'N/A'}</p>
                                        <p><span className='font-semibold text-cyan-950'>Assigned by:</span> {donation.delivery.assignedby?.name || 'N/A'}</p>
                                    </div>
                                </section>
                            )}

                            {(!isAccepted && !isDelivered) && (
                                <section className='rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5'>
                                    <h2 className='text-xl font-semibold text-slate-900'>Current progress</h2>
                                    <p className='mt-3 text-sm text-slate-600'>This donation is still pending review, so only the donor and donation details are available for now.</p>
                                </section>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DonationDetails;
