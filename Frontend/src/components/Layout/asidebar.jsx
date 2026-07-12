
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

const Asidebar = () => {
    const token = localStorage.getItem('token');
    let role = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            role = decoded.user?.role;
        } catch (err) {
            console.error('Invalid token:', err);
        }
    }

    return (
        <aside className='w-60 min-h-screen border-r border-emerald-900/30 bg-slate-950/95 px-4 py-6 text-slate-100 shadow-2xl shadow-slate-950/20'>
            <div className='mb-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4'>
                <p className='text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300'>Quick Links</p>
                <h2 className='mt-2 text-lg font-semibold text-white'>Navigate your workspace</h2>
            </div>
            <nav className='flex flex-col gap-2'>
                {role === 'donor' ? (
                    <div className='space-y-2'>
                        <Link to='/adddonation' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Create Donations</Link>
                        <Link to='/donations' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Active Donations</Link>
                        <Link to='/past-donations' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Past Accepted Donations</Link>
                        <Link to='/rejected-donations' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Rejected Donations</Link>
                    </div>
                ) : null}
                {role === 'delivery' ? (
                    <div className='space-y-2'>
                        <Link to='/deliveries' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Deliveries</Link>
                        <Link to='/accepteddeliveries' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Accepted Deliveries</Link>
                    </div>
                ) : null}
                {role === 'ngos' ? (
                    <div className='space-y-2'>
                        <Link to='/items' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Donated Items</Link>
                        <Link to='/requested' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Requested Items</Link>
                    </div>
                ) : null}
                {role === 'admin' ? (
                    <div className='space-y-2'>
                        <Link to='/admin' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Dashboard</Link>
                        <Link to='/admin/users' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Users</Link>
                        <Link to='/admin/donations' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Donations</Link>
                        <Link to='/admin/assign-deliveries' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Assign Deliveries</Link>
                        <Link to='/admin/deliveries' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Deliveries</Link>
                        <Link to='/admin/reports' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Reports</Link>
                        <Link to='/admin/rejected-donations' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Rejected Donations</Link>
                        <Link to='/admin/notifications' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Notifications</Link>
                        <Link to='/profile' className='group flex items-center rounded-2xl border border-transparent bg-slate-800/80 px-4 py-3 text-sm font-medium text-slate-100 transition hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-500/10'>Admin Profile</Link>
                    </div>
                ) : null}
            </nav>
        </aside>
    );
}

export default Asidebar;
