import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/donations', label: 'Donations' },
  { to: '/admin/assign-deliveries', label: 'Assign Deliveries' },
  { to: '/admin/deliveries', label: 'Deliveries' },
  { to: '/admin/reports', label: 'Reports' },
  { to: '/admin/rejected-donations', label: 'Rejected Donations' },
  { to: '/admin/notifications', label: 'Notifications' },
];

const AdminPageLayout = ({ title, subtitle, actions, children }) => {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl bg-slate-950 p-6 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Admin Control</p>
          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">{title}</h1>
              <p className="mt-2 max-w-3xl text-sm text-slate-300">{subtitle}</p>
            </div>
            {actions}
          </div>
        </header>

        <nav className="mt-6 flex flex-wrap gap-2">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default AdminPageLayout;
