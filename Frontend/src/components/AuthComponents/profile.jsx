import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('You must be logged in to view your profile.');
            setLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user/profile', {
                    headers: {
                        Authorization: token,
                    },
                });
                setUser(response.data.user);
            } catch (err) {
                setError(err.response?.data?.message || 'Unable to fetch profile information from the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4'>
                <div className='rounded-3xl bg-white px-8 py-6 text-lg font-medium text-slate-700 shadow-sm'>Loading profile...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4'>
                <div className='w-full max-w-xl rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm'>
                    <h2 className='mb-2 text-xl font-semibold'>Profile Error</h2>
                    <p>{error}</p>
                </div>
                <NavLink to='/login' className='mt-4 text-emerald-600 hover:underline'>Go to Login</NavLink>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-linear-gradient(135deg,_#f8fffb_0%,_#f0fdf4_100%) px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-200/60'>
                <div className='grid gap-0 lg:grid-cols-[0.8fr_1.2fr]'>
                    <div className='bg-slate-950 p-8 text-white sm:p-10'>
                        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300'>Profile</p>
                        <h1 className='mt-4 text-3xl font-semibold'>Welcome back, {user.name?.split(' ')[0] || 'there'}.</h1>
                        <p className='mt-3 text-slate-300'>Your account details, role, and contact information are all in one place.</p>
                        <div className='mt-8 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/20 text-4xl font-semibold text-emerald-300'>
                            {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                    </div>

                    <div className='p-8 sm:p-10'>
                        <div className='grid gap-4 md:grid-cols-2'>
                            <div className='rounded-[20px] bg-slate-50 p-4'>
                                <h2 className='text-sm uppercase tracking-wide text-slate-500'>Name</h2>
                                <p className='mt-2 text-lg font-semibold text-slate-900'>{user.name}</p>
                            </div>
                            <div className='rounded-[20px] bg-slate-50 p-4'>
                                <h2 className='text-sm uppercase tracking-wide text-slate-500'>Email</h2>
                                <p className='mt-2 text-lg font-semibold text-slate-900'>{user.email}</p>
                            </div>
                            <div className='rounded-[20px] bg-slate-50 p-4'>
                                <h2 className='text-sm uppercase tracking-wide text-slate-500'>Phone</h2>
                                <p className='mt-2 text-lg font-semibold text-slate-900'>{user.phone}</p>
                            </div>
                            <div className='rounded-[20px] bg-slate-50 p-4'>
                                <h2 className='text-sm uppercase tracking-wide text-slate-500'>Address</h2>
                                <p className='mt-2 text-lg font-semibold text-slate-900'>{user.address}</p>
                            </div>
                            <div className='rounded-[20px] bg-emerald-50 p-4 md:col-span-2'>
                                <h2 className='text-sm uppercase tracking-wide text-emerald-700'>Role</h2>
                                <p className='mt-2 text-lg font-semibold capitalize text-slate-900'>{user.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
