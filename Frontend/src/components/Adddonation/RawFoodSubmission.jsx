import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const RawFoodSubmission = ({type}) => {
  const [form, setForm] = useState({
    title: "",
    donationtype:type,
    foodcategory: "",
    quantity: "",
    quantityUnit: "",
    pickupLocation: "",
    availableTill: "",
    expiryDate: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please login before submitting a donation.");
      return;
    }
    
    setSubmitting(true);
    try{
        await axios.post(
        'http://localhost:3000/api/donation/adddonation',
        {
          ...form,
          donationtype: type,
        },
        {
            headers:{
                Authorization:token,
            },
        }
        );
        navigate('/donations')
    }
    catch(error){
        setError(error.response?.data?.message || "Unable to submit donation. Please check all fields.");
    }
    finally {
        setSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200";

  return (
    <form
      onSubmit={handlesubmit}
      className="rounded-32px bg-white p-6 shadow-[0_22px_60px_-40px_rgba(15,23,42,0.45)] ring-1 ring-slate-200"
    >
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-emerald-50 p-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-500/10 text-emerald-700">
            🥬
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Raw Food Donation</h2>
            <p className="text-sm text-slate-600">Fresh produce, grains, dairy and more.</p>
          </div>
        </div>
        <img src="/favicon.svg" alt="Fresh food" className="h-28 w-full rounded-3xl object-cover" />
      </div>

      {error && (
        <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Donation Title</label>
          <input
            className={fieldClass}
            type="text"
            name="title"
            placeholder="Enter a title for your donation"
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Food Category</label>
          <select className={fieldClass} name="foodcategory" onChange={handleChange}>
            <option value="">Select Category</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="grains">Grains</option>
            <option value="dairy">Dairy</option>
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Quantity</label>
            <input
              className={fieldClass}
              type="number"
              name="quantity"
              placeholder="Amount"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Unit</label>
            <select className={fieldClass} name="quantityUnit" onChange={handleChange}>
              <option value="">Select Unit</option>
              <option value="kg">Kg</option>
              <option value="packets">Packets</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Pickup Location</label>
          <input
            className={fieldClass}
            type="text"
            name="pickupLocation"
            placeholder="Where can volunteers pickup?"
            onChange={handleChange}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Available Till</label>
            <input
              className={fieldClass}
              type="datetime-local"
              name="availableTill"
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Expiry Date</label>
            <input
              className={fieldClass}
              type="date"
              name="expiryDate"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex w-full items-center justify-center rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700"
      >
        {submitting ? "Submitting..." : "Submit Donation"}
      </button>
    </form>
  );
};

export default RawFoodSubmission;
