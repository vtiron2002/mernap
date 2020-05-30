import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { customFetch } from '../api/fetch'

export default function Login() {
	const [loginInfo, setLoginInfo] = useState({
		email: 'vtiron2002@gmail.com',
		password: 'Android17',
	})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		document.querySelector('title').innerText = `MERNAP - Login`
	}, [])

	const onChange = ({ target: { value, id } }) => {
		setLoginInfo({ ...loginInfo, [id]: value })
	}

	const onLogin = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		await customFetch({
			url: '/auth/login',
			method: 'POST',
			body: loginInfo,
			auth: false,
		}).then(async (res) => {
			if (res.message) {
				setError(res.message)
				setLoading(false)
			} else {
				localStorage.token = res.token
				document.querySelector('#next').click()
			}
		})
	}

	if (!localStorage.token) {
		return (
			<>
				<div className='login container my-4 d-flex align-items-center justify-content-center'>
					<Link id='next' hidden to='/dashboard'></Link>
					<div className='card p-4 shadow' style={{ width: '500px' }}>
						<h2 className='text-center m-0'>Log in</h2>
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
							<div className='d-flex' style={{ maxHeight: '50px' }}>
								{error && <div className='alert alert-danger flex-fill m-0'>{error}</div>}
								{loading && (
									<div className='alert d-flex justify-content-center align-items-center m-0 flex-fill'>
										<div className='spinner-border text-primary' role='status'>
											<span className='sr-only'>Loading...</span>
										</div>
									</div>
								)}
							</div>

							<hr />
							<button disabled={loading} type='submit' className='btn btn-primary btn-block'>
								Log in
							</button>
							<div className='my-1'>
								Don't have an account? <Link to='/register'>Register here</Link>
							</div>
						</form>
					</div>
				</div>
			</>
		)
	} else {
		return <Redirect to='/dashboard' />
	}
}
