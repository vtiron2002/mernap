import React, { useState } from 'react'
import { customFetch, homeFetch } from '../../api/fetch'

import Loader from '../Loader'

export default function Register() {
	const [registerInfo, setRegisterInfo] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const onChange = ({ target: { name, value } }) => {
		setRegisterInfo({ ...registerInfo, [name]: value })
	}

	const onSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		homeFetch({ type: 'register', setError, setLoading, registerInfo })
	}

	return (
		<div className='register card'>
			<h2>Register</h2>
			<hr />
			<form onSubmit={onSubmit}>
				<div className='form-group'>
					<label htmlFor='name'>Name</label>
					<input
						id='name'
						type='text'
						className='form-control'
						onChange={onChange}
						value={registerInfo.name}
						name='name'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='registerEmail'>Email</label>
					<input
						id='registerEmail'
						type='email'
						className='form-control'
						onChange={onChange}
						value={registerInfo.email}
						name='email'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='registerPassword'>Password</label>
					<input
						id='registerPassword'
						type='password'
						className='form-control'
						onChange={onChange}
						value={registerInfo.password}
						name='password'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='confirmPassword'>Confirm Password</label>
					<input
						id='confirmPassword'
						type='password'
						className='form-control'
						onChange={onChange}
						value={registerInfo.confirmPassword}
						name='confirmPassword'
					/>
				</div>
				<div className='message'>
					{error && <div className='error'>{error}</div>}
					{loading && <Loader />}
				</div>

				<hr />
				<button type='submit' className='btn btn-primary'>
					Register
				</button>
			</form>
		</div>
	)
}
