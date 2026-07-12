import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import {useSelector} from 'react-redux'
import Asidebar from './asidebar'
const Layout = () => {
    const isloggedin = useSelector((state)=>state.user.isloggedin)
    console.log(isloggedin)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
                {isloggedin ? (
                  <Asidebar/>
                ):(<></>)}
                <main style={{ flex: 1, padding: 24, minHeight: 0, overflow: 'auto', backgroundColor: '#f3f4f6' }}>
                    <Outlet />
                </main>
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
