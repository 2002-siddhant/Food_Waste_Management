import React from 'react'
import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
const Signup = ()=>{
    const [name,setName] = useState("");
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [phone,setPhone] = useState("");
    const [address,setAddress] = useState("");
    const [role,setRole] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e)=>{
        e.preventDefault();
        try{
            if(!role) {
                alert("please enter role first")
                return ;
            }
            const res = await axios.post('http://localhost:3000/api/auth/register',{
                name,
                email,
                password,
                phone,
                address,
                role
            });
            console.log(res.data)
            navigate("/login");
            
        }
        catch(err){
            console.log(err.message);
        }
    }
    return(
        <div className='flex flex-col items-center justify-center h-screen'>
            <h1 className='text-2xl font-bold mb-4'>Signup</h1>
            <form className='w-full max-w-sm' onSubmit={handleSubmit}>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Name</label>
                    <input type="text" value={name} onChange={(e)=>setName(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Email</label>
                    <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Password</label>
                    <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Phone</label>
                    <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Address</label>
                    <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
                </div>
                <div className='mb-4'>
                    <label className='block text-gray-700 text-sm font-bold mb-2'>Role</label>
                    <select value={role} onChange={(e)=>setRole(e.target.value)} className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'>
                        <option value="">Select role</option>
                        <option value="donor">Donor</option>
                        <option value="delivery">Delivery</option>
                        <option value="ngos">NGO</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'>Signup</button>
            </form>
        </div>
    );
};

export default Signup;
