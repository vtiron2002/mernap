import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { customFetch } from '../api/fetch'

export default function Register() {
	const [registerInfo, setRegisterInfo] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
	})
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		document.querySelector('title').innerText = `MERNAP - Register`

	}, [])

	const onChange = ({ target: { id, value } }) => {
		setRegisterInfo({ ...registerInfo, [id]: value })
	}

	const onSubmit = async (e) => {
		e.preventDefault()
		setLoading(true)
		setError('')


		await customFetch({
			url: '/auth/register',
			method: 'POST',
			auth: false,
			body: registerInfo,
		}).then((res) => {
			if (res.message) {
				setLoading(false)
				setError(res.message)
			} else {
				localStorage.token = res.token
				document.querySelector('#next').click()
			}
		})
	}

	if (!localStorage.token) {
		return (
			<div className='register container my-4 d-flex align-items-center justify-content-center'>
				<Link id='next' hidden to='/dashboard'></Link>
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
									onChange={onChange}
									value={registerInfo.confirmPassword}
								/>
							</div>
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
						<button type='submit' className='btn btn-primary'>
							Register
						</button>
						<br hidden />

						<span className='mx-3'>
							Already have an account? <Link to='/login'>Login here</Link>
						</span>
					</form>
				</div>
			</div>
		)
	} else {
		return <Redirect to='/dashboard' />
	}
}
