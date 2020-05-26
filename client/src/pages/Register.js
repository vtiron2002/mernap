import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
	const [registerInfo, setRegisterInfo] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [error, setError] = useState('');

	const onChange = (e) => {
		setRegisterInfo({ ...registerInfo, [e.target.id]: e.target.value });
	};

	const onSubmit = (e) => {
		e.preventDefault();
		fetch('/auth/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(registerInfo),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.message) {
					setError(res.message);
				} else {
					localStorage.token = res.token;
					window.location.href = '/dashboard';
				}
			});
	};

	return (
		<div className='container my-4 d-flex align-items-center justify-content-center'>
			<div className='card p-4 w-100 shadow'>
				<h2 className='text-center m-0'>Register</h2>
				<hr />

				<form onSubmit={onSubmit}>
					<div className='form-group'>
						<label htmlFor='name'>Name</label>
						<input
							id='name'
							type='text'
							className='form-control'
							required
							onChange={onChange}
							value={registerInfo.name}
						/>
					</div>
					<div className='form-group'>
						<label htmlFor='email'>Email</label>
						<input
							id='email'
							type='email'
							className='form-control'
							required
							onChange={onChange}
							value={registerInfo.email}
						/>
					</div>
					<div className='form-group row'>
						<div className='col-md-6'>
							<label htmlFor='password'>Password</label>
							<input
								id='password'
								type='password'
								className='form-control'
								required
								onChange={onChange}
								value={registerInfo.password}
							/>
						</div>
						<div className='col-md-6'>
							<label htmlFor='confirmPassword'>Confirm Password</label>
							<input
								id='confirmPassword'
								type='password'
								className='form-control'
								required
								onChange={onChange}
								value={registerInfo.confirmPassword}
							/>
						</div>
					</div>
					{error && <div className='alert alert-danger'>{error}</div>}

					<hr />
					<button type='submit' className='btn btn-primary'>
						Register
					</button>

					<span className='mx-3'>
						Already have an account? <Link to='/login'>Login here</Link>
					</span>
				</form>
			</div>
		</div>
	);
}
