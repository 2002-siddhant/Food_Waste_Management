import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/userreducer';
import NotificationCenter from './NotificationCenter';

const Navbar = () => {
    const isloggedin = useSelector((state) => state.user.isloggedin);
    const dispatch = useDispatch();

    const handlelogout = () => {
        localStorage.removeItem('token');
        dispatch(logout());
    };

    const navItemClass = 'flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-700 transition';
    const iconClass = 'h-4 w-4';

    return (
        <nav className='bg-gray-800 text-white p-4 flex items-center'>
            <div className='text-2xl font-bold'>Food Waste Management</div>
            <div className='flex-1 flex justify-center items-center space-x-2'>
                <NavLink to='/' className={navItemClass}>
                    <span>Home</span>
                </NavLink>
                <NavLink to='/about' className={navItemClass}>
                    <span>About Us</span>
                </NavLink>
                <NavLink to='/contact' className={navItemClass}>
                    <span>Contact</span>
                </NavLink>
            </div>
            <div className='flex items-center space-x-2'>
                {!isloggedin ? (
                    <>
                        <NavLink to='/login' className={navItemClass}>
                            <span>Login</span>
                        </NavLink>
                        <NavLink to='/signup' className={navItemClass}>
                            <span>Signup</span>
                        </NavLink>
                    </>
                ) : (
                    <>
                        <NotificationCenter />
                        <NavLink to='/profile' className={navItemClass}>
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className={iconClass}>
                                <path d='M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zm0 2c-3.866 0-7 3.134-7 7h2c0-2.761 2.239-5 5-5s5 2.239 5 5h2c0-3.866-3.134-7-7-7z' />
                            </svg>
                            <span>Profile</span>
                        </NavLink>
                        <button onClick={handlelogout} className={`${navItemClass} bg-red-600 hover:bg-red-700`}>
                            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='currentColor' className={iconClass}>
                                <path d='M16 13v-2H7V8l-5 4 5 4v-3h9zm4-11H4c-1.103 0-2 .897-2 2v4h2V4h16v16H4v-4H2v4c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z' />
                            </svg>
                            <span>Logout</span>
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
