import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
	const [loginInfo, setLoginInfo] = useState({
		email: '',
		password: '',
	});
	const [error, setError] = useState('')

	const onChange = (e) => {
		setLoginInfo({ ...loginInfo, [e.target.id]: e.target.value });
  };
  
  const onSubmit = e => {
		e.preventDefault()
		fetch('/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginInfo)
		}).then(res => res.json()).then(res => {
			if (res.message) {
				setError(res.message)
			} else {
				localStorage.token = res.token
				window.location.href = '/dashboard'
			}
		});
  }

	return (
		<div
			style={{ height: '100%' }}
			className='container my-4 d-flex align-items-center justify-content-center'
		>
			<div className='card p-4 sm-w-50 shadow'>
				<h2 className='text-center m-0'>Log in</h2>
				<hr />

				<form onSubmit={onSubmit}>
					<div className='form-group'>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							type='email'
							className='form-control'
							required
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
							required
							onChange={onChange}
							value={loginInfo.password}
						/>
					</div>
					{error && <div className='alert alert-danger'>{error}</div>}

					<hr />
					<button type='submit' className='btn btn-primary'>
						Log in
					</button>
					<span className='mx-3'>
						Don't have an account? <Link to='/register'>Register here</Link>
					</span>
				</form>
			</div>
		</div>
	);
}
