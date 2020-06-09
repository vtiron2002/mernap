import React, { useState, useContext } from 'react'
import { customFetch } from '../../api/fetch'
import { UserContext } from '../../App'

export default function DeleteAccount({ modal, setModal, user }) {
	const { setUser } = useContext(UserContext)

	const closeModal = () => {
		setModal(false)
	}

	const [modalMsg, setModalMsg] = useState('')
	const [email, setEmail] = useState('')

	const deleteAccount = async (e) => {
		e.preventDefault()
		try {
			if (user.email !== email) throw Error(`Doesn't match email`)

			setModalMsg('')
			const { result } = await customFetch({
				url: '/data/deleteAccount',
				method: 'POST',
				body: { id: user._id },
			})

			if (result) {
				delete localStorage.token
				delete localStorage.email
				setUser({})
				window.location.href = '/'
			}
		} catch (e) {
			setModalMsg(e.message)
		}
	}

	return (
		<div
			className='modal'
			style={{
				display: modal ? 'flex' : 'none',
				opacity: modal ? '100%' : '0',
			}}
		>
			<div className='modal-dialog card'>
				<div className='modal-content'>
					<div className='modal-header'>
						<h5 className='modal-title' id='exampleModalLabel'>
							Are you sure you want to delete your account?
						</h5>
						<button onClick={closeModal} type='button' className='close'>
							<span>×</span>
						</button>
					</div>
					<div className='modal-body'>
						<form onSubmit={deleteAccount}>
							<div className='form-group'>
								<label>
									Enter <kbd>{user.email}</kbd> to delete your account.
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
