import React, {useState} from 'react'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'
import {useDispatch} from 'react-redux'
import {login} from '../../redux/userreducer'
const Login = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const handleSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const res = await axios.post('http://localhost:3000/api/auth/login', {
				email,
				password,
			})
			const { token, message } = res.data
			if (token) {
				localStorage.setItem('token', token)
				dispatch(login())
				navigate('/')
			} else {
				setError(message || 'Login failed')
			}
		} catch (err) {
			setError(err.response?.data?.message || err.message || 'Server error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="flex flex-col items-center justify-center h-screen">
			<h1 className="text-2xl font-bold mb-4">Login</h1>
			<form className="w-full max-w-sm" onSubmit={handleSubmit}>
				{error && <p className="text-red-500 mb-2">{error}</p>}
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						required
					/>
				</div>
				<div className="mb-4">
					<label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						required
					/>
				</div>
				<button
					type="submit"
					className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
					disabled={loading}
				>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</form>
		</div>
	)
}

export default Login
