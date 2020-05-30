import React, { useState, useContext } from 'react'
import { customFetch } from '../../api/fetch'
import { Link } from 'react-router-dom'
import { UserContext } from '../../UserContext'

export default function DeleteAccount({ modal, setModal, user }) {
	const { setUser } = useContext(UserContext)

	const closeModal = () => {
		setModal(false)
	}

	const [modalMsg, setModalMsg] = useState('')
	const [email, setEmail] = useState('')

	const deleteAccount = async () => {
		try {
			if (user.email !== email) throw Error(`Doesn't match email`)

			setModalMsg('')
			await customFetch({
				url: '/data/deleteAccount',
				method: 'POST',
				body: { id: user._id },
			}).then((res) => {
				if (res.status === 'ok') {
					delete localStorage.token
					document.querySelector('#next').click()
					setUser({})
				}
			})
		} catch (e) {
			setModalMsg(e.message)
		}
	}

	return (
		<div
			className='modal customModal'
			style={{
				display: modal ? 'flex' : 'none',
				opacity: modal ? '100%' : '0',
			}}
		>
			<div className='modal-dialog customModalDialog'>
				<Link id='next' hidden to='/'></Link>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='exampleModalLabel'>
							Are you sure you want to delete your account?
						</h5>
						<button onClick={closeModal} type='button' className='close'>
							<span>&times;</span>
						</button>
					</div>
					<div className='modal-body'>
						<form>
							<div className='form-group'>
								<label>
									Enter: <kbd>{user.email}</kbd> to delete account.
								</label>
								<input
									type='text'
									className='form-control'
									placeholder='Email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
								/>
								<span className='text-danger'>{modalMsg}</span>
							</div>
						</form>
					</div>
					<div className='modal-footer'>
						<button onClick={closeModal} type='button' className='btn btn-success'>
							Cancel
						</button>
						<button onClick={deleteAccount} type='button' className='btn btn-danger'>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
