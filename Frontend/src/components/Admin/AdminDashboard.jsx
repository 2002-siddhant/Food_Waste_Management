import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

const statusOptions = ["", "available", "accepted", "assigned", "pickedup", "delivered", "rejected"];
const roleOptions = ["", "donor", "ngos", "delivery", "admin"];

const badgeClass = (status) => {
    const classes = {
        available: "bg-emerald-100 text-emerald-800",
        accepted: "bg-sky-100 text-sky-800",
        assigned: "bg-violet-100 text-violet-800",
        pickedup: "bg-indigo-100 text-indigo-800",
        delivered: "bg-emerald-600 text-white",
        rejected: "bg-rose-100 text-rose-800",
        pending: "bg-amber-100 text-amber-800",
    };
    return classes[status] || "bg-slate-100 text-slate-800";
};

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [recentDonations, setRecentDonations] = useState([]);
    const [users, setUsers] = useState([]);
    const [donations, setDonations] = useState([]);
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [roleFilter, setRoleFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [assignment, setAssignment] = useState({});
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const headers = useMemo(() => ({
        Authorization: token,
    }), [token]);

    const loadDashboard = async () => {
        const response = await axios.get("http://localhost:3000/api/admin/dashboard", { headers });
        setStats(response.data.stats);
        setRecentDonations(response.data.recentDonations || []);
    };

    const loadUsers = async (role = roleFilter) => {
        const response = await axios.get("http://localhost:3000/api/admin/users", {
            headers,
            params: role ? { role } : {},
        });
        setUsers(response.data.users || []);
    };

    const loadDonations = async (status = statusFilter) => {
        const response = await axios.get("http://localhost:3000/api/admin/donations", {
            headers,
            params: status ? { status } : {},
        });
        setDonations(response.data.donations || []);
    };

    const loadDeliveryPartners = async () => {
        const response = await axios.get("http://localhost:3000/api/admin/delivery-partners", { headers });
        setDeliveryPartners(response.data.deliveryPartners || []);
    };

    const loadAll = async () => {
        if (!token) {
            setError("Please login as admin to view this page.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError("");
        try {
            await Promise.all([
                loadDashboard(),
                loadUsers(),
                loadDonations(),
                loadDeliveryPartners(),
            ]);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load admin dashboard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAll();
    }, []);

    const handleRoleFilter = async (role) => {
        setRoleFilter(role);
        try {
            await loadUsers(role);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to filter users.");
        }
    };

    const handleStatusFilter = async (status) => {
        setStatusFilter(status);
        try {
            await loadDonations(status);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to filter donations.");
        }
    };

    const handleAssignDelivery = async (donationId) => {
        const deliveryPartnerId = assignment[donationId];
        if (!deliveryPartnerId) {
            alert("Please select a delivery partner first.");
            return;
        }

        setActionLoading(donationId);
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/admin/donations/${donationId}/assign-delivery`,
                { deliveryPartnerId },
                { headers }
            );

            setDonations((current) =>
                current.map((donation) =>
                    donation._id === donationId ? response.data.donation : donation
                )
            );
            await loadDashboard();
        } catch (err) {
            alert(err.response?.data?.message || "Unable to assign delivery partner.");
        } finally {
            setActionLoading("");
        }
    };

    const handleRejectDonation = async (donationId) => {
        setActionLoading(donationId);
        try {
            const response = await axios.patch(
                `http://localhost:3000/api/admin/donations/${donationId}/reject`,
                {},
                { headers }
            );

            setDonations((current) =>
                current.map((donation) =>
                    donation._id === donationId ? response.data.donation : donation
                )
            );
            await loadDashboard();
        } catch (err) {
            alert(err.response?.data?.message || "Unable to reject donation.");
        } finally {
            setActionLoading("");
        }
    };

    const statCards = stats ? [
        ["Total Users", stats.totalUsers],
        ["Donors", stats.totalDonors],
        ["NGOs", stats.totalNgos],
        ["Delivery Partners", stats.totalDeliveryPartners],
        ["Admins", stats.totalAdmins],
        ["Donations", stats.totalDonations],
    ] : [];

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100">
                <div className="rounded-3xl bg-white p-8 text-center shadow-lg">
                    <p className="text-xl font-semibold text-slate-900">Loading admin dashboard...</p>
                    <p className="mt-2 text-sm text-slate-500">Collecting users, donations, and delivery data.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <div className="max-w-xl rounded-3xl bg-white p-8 text-center shadow-lg">
                    <h1 className="text-2xl font-semibold text-rose-700">Admin Error</h1>
                    <p className="mt-3 text-slate-600">{error}</p>
                    <NavLink to="/login" className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
                        Login
                    </NavLink>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-8">
                <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
                    <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Admin Control</p>
                    <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <h1 className="text-3xl font-semibold">Food donation operations dashboard</h1>
                            <p className="mt-2 max-w-3xl text-sm text-slate-300">
                                Monitor users, track donation status, assign delivery partners, and manage rejected or completed donations.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={loadAll}
                            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                        >
                            Refresh
                        </button>
                    </div>
                </header>

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
                    {statCards.map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <p className="text-sm text-slate-500">{label}</p>
                            <p className="mt-3 text-3xl font-semibold text-slate-900">{value}</p>
                        </div>
                    ))}
                </section>

                <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-xl font-semibold text-slate-900">Donations by status</h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-2">
                            {["available", "accepted", "assigned", "pickedup", "delivered", "rejected"].map((status) => (
                                <div key={status} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                    <p className="text-sm capitalize text-slate-500">{status}</p>
                                    <p className="mt-2 text-2xl font-semibold text-slate-900">{stats?.donationsByStatus?.[status] || 0}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <h2 className="text-xl font-semibold text-slate-900">Recent donation activity</h2>
                        <div className="mt-5 space-y-3">
                            {recentDonations.length === 0 ? (
                                <p className="text-sm text-slate-500">No donation activity yet.</p>
                            ) : recentDonations.map((donation) => (
                                <div key={donation._id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                                    <div>
                                        <p className="font-semibold text-slate-900">{donation.title}</p>
                                        <p className="mt-1 text-sm text-slate-500">Donor: {donation.donor?.name || "N/A"}</p>
                                    </div>
                                    <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeClass(donation.status)}`}>
                                        {donation.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Manage users</h2>
                            <p className="mt-1 text-sm text-slate-500">View platform users by role.</p>
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(event) => handleRoleFilter(event.target.value)}
                            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
                        >
                            {roleOptions.map((role) => (
                                <option key={role || "all"} value={role}>{role ? role : "All roles"}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-5 overflow-x-auto">
                        <table className="min-w-full text-left text-sm">
                            <thead className="bg-slate-950 text-white">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id} className="border-b border-slate-100">
                                        <td className="px-4 py-3 font-semibold text-slate-900">{user.name}</td>
                                        <td className="px-4 py-3 capitalize text-slate-600">{user.role}</td>
                                        <td className="px-4 py-3 text-slate-600">{user.email}</td>
                                        <td className="px-4 py-3 text-slate-600">{user.phone}</td>
                                        <td className="px-4 py-3 text-slate-600">{user.address}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Manage donations</h2>
                            <p className="mt-1 text-sm text-slate-500">Assign delivery partners after NGO acceptance, or reject invalid donations.</p>
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(event) => handleStatusFilter(event.target.value)}
                            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-500"
                        >
                            {statusOptions.map((status) => (
                                <option key={status || "all"} value={status}>{status ? status : "All statuses"}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-5 space-y-4">
                        {donations.length === 0 ? (
                            <p className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">No donations found.</p>
                        ) : donations.map((donation) => (
                            <article key={donation._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h3 className="text-lg font-semibold text-slate-900">{donation.title}</h3>
                                            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badgeClass(donation.status)}`}>
                                                {donation.status}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {donation.foodcategory} · {donation.donationtype} · {donation.quantity} {donation.quantityUnit}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-600">Pickup: {donation.pickupLocation}</p>
                                        <div className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-3">
                                            <p><span className="font-semibold text-slate-900">Donor:</span> {donation.donor?.name || "N/A"}</p>
                                            <p><span className="font-semibold text-slate-900">NGO:</span> {donation.acceptedBy?.name || "Not accepted"}</p>
                                            <p><span className="font-semibold text-slate-900">Delivery:</span> {donation.deliveryPartner?.name || "Not assigned"}</p>
                                        </div>
                                    </div>

                                    <div className="flex min-w-72 flex-col gap-3">
                                        <select
                                            value={assignment[donation._id] || donation.deliveryPartner?._id || ""}
                                            onChange={(event) =>
                                                setAssignment((current) => ({
                                                    ...current,
                                                    [donation._id]: event.target.value,
                                                }))
                                            }
                                            disabled={donation.status !== "accepted" && donation.status !== "assigned"}
                                            className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 outline-none disabled:bg-slate-200"
                                        >
                                            <option value="">Select delivery partner</option>
                                            {deliveryPartners.map((partner) => (
                                                <option key={partner._id} value={partner._id}>{partner.name} · {partner.phone}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => handleAssignDelivery(donation._id)}
                                            disabled={(donation.status !== "accepted" && donation.status !== "assigned") || actionLoading === donation._id}
                                            className="rounded-full bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                                        >
                                            {actionLoading === donation._id ? "Working..." : "Assign Delivery"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRejectDonation(donation._id)}
                                            disabled={donation.status === "delivered" || donation.status === "rejected" || actionLoading === donation._id}
                                            className="rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
                                        >
                                            Reject Donation
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AdminDashboard;
