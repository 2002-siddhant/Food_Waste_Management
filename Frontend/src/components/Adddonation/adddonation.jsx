import { useState } from "react";
import DonationTypeSelector from "./DonationSelector";
import RawFoodSubmission from "./RawFoodSubmission";
import CookedFoodSubmission from "./CookedFoodSubmission";

const Adddonation = () => {
  const [type, setType] = useState("raw");

  return (
    <section className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-4xl bg-white/95 p-6 shadow-2xl shadow-slate-300/20 ring-1 ring-slate-200">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-600">Donation</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Share surplus food with the community</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Select the donation type and complete the form below with the food details, availability, and pickup location.
              </p>
            </div>
            <img
              src="/favicon.svg"
              alt="Donation badge"
              className="h-20 w-20 rounded-3xl border border-slate-200 bg-slate-100 p-3"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <DonationTypeSelector type={type} setType={setType} />
          {type === "raw" ? <RawFoodSubmission type={type} /> : <CookedFoodSubmission type={type} />}
        </div>
      </div>
    </section>
  );
};

export default Adddonation;