import React, { useState } from 'react'

import Loader from '../Loader'

import { customFetch, homeFetch } from '../../api/fetch'
import Card from '../Card'

export default function Login() {
	const [loginInfo, setLoginInfo] = useState({
		email: '',
		password: '',
	})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const onChange = ({ target: { value, id } }) => {
		setLoginInfo({ ...loginInfo, [id]: value })
	}

	const onLogin = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		homeFetch({ type: 'login', setError, setLoading, loginInfo })
	}

	return (
		<Card>
			<h2>Log in</h2>
			<hr />

			<form onSubmit={onLogin}>
				<div className='form-group'>
					<label htmlFor='email'>Email</label>
					<input
						id='email'
						type='email'
						className='form-control'
						onChange={onChange}
						value={loginInfo.email}
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='password'>Password</label>
					<input
						id='password'
						type='password'
						className='form-control'
						onChange={onChange}
						value={loginInfo.password}
					/>
				</div>
				<div className='message'>
					{error && <div className='error'>{error}</div>}
					{loading && <Loader />}
				</div>

				<hr />
				<button disabled={loading} type='submit'>
					Log in
				</button>
			</form>
		</Card>
	)
}
