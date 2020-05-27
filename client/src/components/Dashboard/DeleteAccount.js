import React, { useState } from 'react'

export default function DeleteAccount({ modal, setModal, user }) {
	const closeModal = () => {
		setModal(false)
	}

	const [modalMsg, setModalMsg] = useState('')
	const [email, setEmail] = useState('')

	const deleteAccount = () => {
		try {
			if (user.email !== email) throw Error(`Doesn't match email`)

			setModalMsg('')
			fetch('/data/deleteAccount', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					authorization: `Bearer ${localStorage.token}`,
				},
				body: JSON.stringify({ id: user._id }),
			})
				.then((res) => res.json())
				.then((res) => {
					if (res.status === 'ok') {
						delete localStorage.token
						window.location.href = '/login'
					}
				})
		} catch (e) {
			setModalMsg(e.message)
		}
	}

	return (
		<div
			class='modal customModal'
			style={{
				display: modal ? 'flex' : 'none',
				opacity: modal ? '100%' : '0',
			}}
		>
			<div class='modal-dialog customModalDialog'>
				<div class='modal-content'>
					<div class='modal-header'>
						<h5 class='modal-title' id='exampleModalLabel'>
							Are you sure you want to delete your account?
						</h5>
						<button onClick={closeModal} type='button' class='close'>
							<span>&times;</span>
						</button>
					</div>
					<div class='modal-body'>
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
					<div class='modal-footer'>
						<button onClick={closeModal} type='button' class='btn btn-success'>
							Cancel
						</button>
						<button onClick={deleteAccount} type='button' class='btn btn-danger'>
							Delete
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}
