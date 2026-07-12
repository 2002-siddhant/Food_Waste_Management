import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const statCards = [
    { title: 'Meals rescued', value: '12k+' },
    { title: 'Active partners', value: '350+' },
    { title: 'Communities served', value: '40+' },
];

export const Home = () => {
    const navigate = useNavigate();
    const isloggedin = useSelector((state) => state.user.isloggedin);

    return (
        <div className='min-h-screen bg-radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),_transparent_30%),linear-gradient(135deg,_#f8fffb_0%,_#f0fdf4_45%,_#ecfeff_100%) px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mx-auto flex max-w-7xl flex-col gap-8'>
                <section className='grid gap-8 overflow-hidden rounded-4xl bg-slate-950 px-6 py-8 text-white shadow-2xl shadow-emerald-950/20 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10'>
                    <div className='flex flex-col justify-center'>
                        <p className='mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-emerald-300'>Food Waste Management</p>
                        <h1 className='text-4xl font-bold leading-tight sm:text-5xl'>Turn surplus food into hope for your community.</h1>
                        <p className='mt-5 max-w-2xl text-lg text-slate-300'>Donors, NGOs, delivery partners, and admins work together to reduce waste, feed people, and create a more sustainable future.</p>
                        <div className='mt-8 flex flex-wrap gap-3'>
                            {!isloggedin ? (
                                <button
                                    onClick={() => navigate('/signup')}
                                    className='rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition hover:bg-emerald-400'
                                >
                                    Get Started
                                </button>
                            ) : null}
                            <NavLink to='/about' className='rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10'>Learn More</NavLink>
                        </div>
                    </div>
                    <div className='overflow-hidden rounded-[28px] border border-white/10 bg-white/10 p-2 backdrop-blur-sm'>
                        <img
                            src='https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80'
                            alt='Volunteers distributing food'
                            className='h-full min-h-280px w-full rounded-3xl object-cover'
                        />
                    </div>
                </section>

                <section className='grid gap-4 md:grid-cols-3'>
                    {statCards.map((card) => (
                        <div key={card.title} className='rounded-3xl border border-emerald-100 bg-white p-6 shadow-sm shadow-emerald-100'>
                            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600'>{card.title}</p>
                            <p className='mt-3 text-3xl font-bold text-slate-900'>{card.value}</p>
                        </div>
                    ))}
                </section>

                <section className='grid gap-6 rounded-4xl bg-white p-6 shadow-xl shadow-slate-200/70 lg:grid-cols-[1fr_1fr] lg:p-8'>
                    <div>
                        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600'>How it works</p>
                        <h2 className='mt-3 text-3xl font-semibold text-slate-900'>From donation to delivery in a few simple steps</h2>
                        <p className='mt-4 text-lg text-slate-600'>A donor posts surplus food, an NGO accepts it, and a delivery partner ensures it reaches the right people quickly.</p>
                        <div className='mt-6 space-y-3'>
                            {['Post your surplus food', 'Let NGOs accept it', 'Assign delivery and track impact'].map((step) => (
                                <div key={step} className='flex items-center gap-3 rounded-2xl bg-emerald-50 px-4 py-3 text-slate-700'>
                                    <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white'>✓</span>
                                    <span className='font-medium'>{step}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='overflow-hidden rounded-3xl'>
                        <img
                            src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80'
                            alt='Community kitchen distribution'
                            className='h-full min-h-280px w-full object-cover'
                        />
                    </div>
                </section>
            </div>
        </div>
    );
};

export const About = () => {
    return (
        <div className='min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mx-auto max-w-6xl space-y-6'>
                <section className='overflow-hidden rounded-4xl bg-white shadow-xl shadow-slate-200/70'>
                    <div className='grid gap-0 lg:grid-cols-[1fr_0.9fr]'>
                        <div className='p-8 sm:p-10 lg:p-12'>
                            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600'>About us</p>
                            <h1 className='mt-3 text-4xl font-bold text-slate-900'>We connect food, people, and purpose.</h1>
                            <p className='mt-5 text-lg leading-8 text-slate-600'>Food Waste Management is a smart platform that helps donors share surplus food with NGOs and delivery partners before it expires. Our mission is simple: reduce waste, serve communities, and create a more sustainable food ecosystem.</p>
                        </div>
                        <img
                            src='https://images.unsplash.com/photo-1528712306091-ed0763094c98?auto=format&fit=crop&w=900&q=80'
                            alt='Community support and food sharing'
                            className='h-full min-h-280px w-full object-cover'
                        />
                    </div>
                </section>

                <section className='grid gap-6 md:grid-cols-3'>
                    {[
                        { title: 'Our vision', text: 'Build a world where surplus food reaches people before it becomes waste.' },
                        { title: 'Our impact', text: 'Support local shelters, NGOs, and families with fast, transparent coordination.' },
                        { title: 'Our promise', text: 'Keep the flow of food safe, efficient, and humane through every step.' },
                    ].map((item) => (
                        <div key={item.title} className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                            <h3 className='text-xl font-semibold text-slate-900'>{item.title}</h3>
                            <p className='mt-3 text-slate-600'>{item.text}</p>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
};

export const Contact = () => {
    return (
        <div className='min-h-screen bg-linear-gradient(135deg,_#f9fefb_0%,_#f0fdf4_100%) px-4 py-8 sm:px-6 lg:px-8'>
            <div className='mx-auto flex max-w-6xl flex-col gap-6'>
                <section className='overflow-hidden rounded-4xl bg-slate-950 text-white shadow-2xl shadow-slate-300/50'>
                    <div className='grid gap-0 lg:grid-cols-[1fr_0.8fr]'>
                        <div className='p-8 sm:p-10 lg:p-12'>
                            <p className='text-sm font-semibold uppercase tracking-[0.3em] text-emerald-300'>Contact us</p>
                            <h1 className='mt-3 text-4xl font-bold'>We would love to hear from you.</h1>
                            <p className='mt-5 max-w-xl text-lg text-slate-300'>Have a question, want to volunteer, or need support with the platform? Reach out and we will get back to you soon.</p>
                            <div className='mt-8 space-y-3'>
                                <a href='mailto:info@foodwastemanagement.com' className='flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/20'>
                                    <span className='text-emerald-300'>✉</span>
                                    <span>info@foodwastemanagement.com</span>
                                </a>
                                <a href='https://www.instagram.com' target='_blank' rel='noreferrer' className='flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 transition hover:bg-white/20'>
                                    <span className='text-emerald-300'>📱</span>
                                    <span>Follow us on Instagram</span>
                                </a>
                            </div>
                        </div>
                        <img
                            src='https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80'
                            alt='Community meal sharing'
                            className='h-full min-h-280px w-full object-cover'
                        />
                    </div>
                </section>

                <section className='grid gap-6 md:grid-cols-2'>
                    <div className='rounded-3xl border border-slate-200 bg-white p-6 shadow-sm'>
                        <h2 className='text-2xl font-semibold text-slate-900'>Partner with us</h2>
                        <p className='mt-3 text-slate-600'>If you are a donor, NGO, or delivery partner, we would love to collaborate and expand impact together.</p>
                    </div>
                    <div className='rounded-3xlborder border-slate-200 bg-white p-6 shadow-sm'>
                        <h2 className='text-2xl font-semibold text-slate-900'>CEO / Manager</h2>
                        <div className='mt-4 space-y-2 text-slate-600'>
                            <p><span className='font-semibold text-slate-900'>Name:</span> Siddhant Mishra</p>
                            <p><span className='font-semibold text-slate-900'>Role:</span> CEO / Manager</p>
                            <p><span className='font-semibold text-slate-900'>Phone:</span> 6393513528</p>
                            <p><span className='font-semibold text-slate-900'>Email:</span> mishrasiddhant3252@gmail.com</p>
                            <p><span className='font-semibold text-slate-900 '>Instagram:</span><a href='https://www.instagram.com/siddhant57/' className='text-emerald-500 hover:text-emerald-600'> @siddhant57</a></p>
                            <p><span className='font-semibold text-slate-900'>Linkedin:</span><a href = 'https://www.linkedin.com/in/siddhant-mishra-965762237/'className = 'text-emerald-500 hover:text-emerald-600'> @siddhant-mishra-965762237</a></p>
                            <p><span className='font-semibold text-slate-900'>Location:</span> India</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
