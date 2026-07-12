import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, NavLink } from 'react-router-dom';

const DonationCard = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to view this donation.');
      setLoading(false);
      return;
    }

    const fetchDonation = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/donation/${id}`, {
          headers: { Authorization: token },
        });
        setDonation(res.data.donation);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load donation.');
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="rounded-lg bg-white p-6 shadow">{error}</div>
      </div>
    );

  if (!donation) return null;

  const donor = donation.donor || {};
  const canAccept = donation.status === 'pending' || donation.status === 'available';

  const handleAccept = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to accept this donation.');
      return;
    }

    setAccepting(true);
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/donation/${id}/accept`,
        {},
        {
          headers: { Authorization: token },
        }
      );
      setDonation(res.data.donation);
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to accept donation.');
    } finally {
      setAccepting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <article className="overflow-hidden rounded-3xl bg-white shadow-2xl">
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.95fr]">
            <section className="bg-linear-to-br from-emerald-500 via-cyan-500 to-slate-900 p-8 text-white">
              <div className="flex flex-col gap-4">
                <p className="text-sm uppercase tracking-[0.35em] text-cyan-100/80">Donation Information</p>
                <h1 className="text-4xl font-bold tracking-tight">{donation.title}</h1>
                <p className="text-sm text-cyan-100/80">Full donation details including type, category, and quantity.</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">Category</p>
                    <p className="mt-2 text-lg font-semibold">{donation.foodcategory}</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">Type</p>
                    <p className="mt-2 text-lg font-semibold">{donation.donationtype}</p>
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">Quantity</p>
                    <p className="mt-2 text-lg font-semibold">{donation.quantity} {donation.quantityUnit}</p>
                  </div>
                  <div className="rounded-3xl bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">Status</p>
                    <p className="mt-2 text-lg font-semibold capitalize">{donation.status || 'pending'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-950/95 p-8 text-white">
              <div className="flex items-center gap-4 rounded-3xl bg-white/5 p-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-500/20 text-cyan-200 text-2xl">👤</div>
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-cyan-200/80">Donor Information</p>
                  <h2 className="mt-2 text-2xl font-semibold">{donor.name || 'Unknown Donor'}</h2>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">Email</p>
                  <p className="mt-2 text-base font-semibold">{donor.email || 'Not provided'}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">Phone</p>
                  <p className="mt-2 text-base font-semibold">{donor.phone || 'Not provided'}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">Address</p>
                  <p className="mt-2 text-base font-semibold">{donor.address || 'Not provided'}</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-100/70">Role</p>
                  <p className="mt-2 text-base font-semibold capitalize">{donor.role || 'unknown'}</p>
                </div>
              </div>
            </section>
          </div>
        </article>

        <article className="rounded-3xl bg-white p-8 shadow-lg">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Pickup Location</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{donation.pickupLocation}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Available Till</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{new Date(donation.availableTill).toLocaleString()}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Last Updated</p>
              <p className="mt-3 text-xl font-semibold text-slate-900">{new Date(donation.updatedAt || donation.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {donation.expiryDate && (
              <div className="rounded-3xl border border-slate-200 p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Expiry Date</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{new Date(donation.expiryDate).toLocaleDateString()}</p>
              </div>
            )}
            {donation.cookedAt && (
              <div className="rounded-3xl border border-slate-200 p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Cooked At</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{new Date(donation.cookedAt).toLocaleString()}</p>
              </div>
            )}
            {donation.vegType && (
              <div className="rounded-3xl border border-slate-200 p-6">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Food Type</p>
                <p className="mt-3 text-lg font-semibold text-slate-900">{donation.vegType}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">This card combines donor info and donation details for a complete view.</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              {canAccept && (
                <button
                  type="button"
                  onClick={handleAccept}
                  disabled={accepting}
                  className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  {accepting ? 'Accepting...' : 'Accept Donation'}
                </button>
              )}
              <NavLink to="/items" className="inline-flex items-center justify-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800">
                Back to Items
              </NavLink>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default DonationCard;
