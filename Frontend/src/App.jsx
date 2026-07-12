import React from 'react'
import {Routes,Route} from 'react-router-dom';
import Layout from './components/Layout/layout';
import {Home,About,Contact} from './components/Layout/pages';
import Login from './components/AuthComponents/Login';
import Signup from './components/AuthComponents/signup';
import Profile from './components/AuthComponents/profile';
import Adddonation from './components/Adddonation/adddonation';
import Donations from './components/Donor/Donations';
import PastDonations from './components/Donor/PastDonations';
import RejectedDonations from './components/Donor/RejectedDonations';
import DonationDetails from './components/Donor/DonationDetails';
import Accepted from './components/Delieveries/Accepted';
import Deliveries from './components/Delieveries/Deliveries';
import Items from './components/NGOS/Items';
import Requested from './components/NGOS/Requested';
import DonationCard from './components/NGOS/DonationCard';
import AdminDashboard from './components/Admin/AdminDashboard';
import AdminUsers from './components/Admin/AdminUsers';
import AdminDonations from './components/Admin/AdminDonations';
import AdminAssignDeliveries from './components/Admin/AdminAssignDeliveries';
import AdminDeliveries from './components/Admin/AdminDeliveries';
import AdminReports from './components/Admin/AdminReports';
import AdminRejectedDonations from './components/Admin/AdminRejectedDonations';
import AdminNotifications from './components/Admin/AdminNotifications';
import './index.css';

function App(){
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path = "profile" element = {<Profile/>}/>
        <Route path='adddonation' element ={<Adddonation/>}/>
        <Route path='donations' element = {<Donations/>}/>
        <Route path='past-donations' element = {<PastDonations/>}/>
        <Route path='rejected-donations' element = {<RejectedDonations/>}/>
        <Route path='mydonation/:id' element = {<DonationDetails/>}/>
        <Route path='accepteddeliveries' element = {<Accepted/>}/>
        <Route path = 'deliveries' element = {<Deliveries/>}/>
        <Route path='items' element = {<Items/>}/>
        <Route path='donation/:id' element = {<DonationCard/>}/>
        <Route path = 'requested' element = {<Requested/>}/>
        <Route path = 'admin' element = {<AdminDashboard/>}/>
        <Route path = 'admin/users' element = {<AdminUsers/>}/>
        <Route path = 'admin/donations' element = {<AdminDonations/>}/>
        <Route path = 'admin/assign-deliveries' element = {<AdminAssignDeliveries/>}/>
        <Route path = 'admin/deliveries' element = {<AdminDeliveries/>}/>
        <Route path = 'admin/reports' element = {<AdminReports/>}/>
        <Route path = 'admin/rejected-donations' element = {<AdminRejectedDonations/>}/>
        <Route path = 'admin/notifications' element = {<AdminNotifications/>}/>
      </Route>
      
    </Routes>
  );
}

export default App;
