import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

export default function Login() {
	const [loginInfo, setLoginInfo] = useState({
		email: '',
		password: '',
	})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const onChange = ({target: {value, id}}) => {
		setLoginInfo({ ...loginInfo, [id]: value })
	}

	const onLogin = (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')

		fetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginInfo),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.message) {
					setError(res.message)
					setLoading(false)
				} else {
					localStorage.token = res.token
					window.location.href = '/dashboard'
				}
			})
	}

	if (!localStorage.token) {
		return (
			<div className='login container my-4 d-flex align-items-center justify-content-center'>
				<div className='card p-4 shadow' style={{width: '500px'}}>
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
									<div class='spinner-border text-primary' role='status'>
										<span class='sr-only'>Loading...</span>
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
		)
	} else {
		return <Redirect to="/dashboard" />
	}
}
