import React, { useState, useContext, useEffect } from 'react'
import DeleteAccount from './DeleteAccount'
import { UserContext } from '../../UserContext'

import { customFetch } from '../../api/fetch'

export default function EditProfile({ setChangesSavedMessage, toggleEdit }) {
	const { user, setUser } = useContext(UserContext)

	const [modal, setModal] = useState(false)

	useEffect(() => {
		if (modal) {
			document.querySelector('body').style.overflow = 'hidden'
		} else {
			document.querySelector('body').style.removeProperty('overflow')
		}
	}, [modal])

	const onChange = (e) => {
		setUser({ ...user, [e.target.id]: e.target.value })
	}

	const onSubmitChanges = (e) => {
		e.preventDefault()
		customFetch({ url: '/data/editProfile', method: 'POST', body: user }).then()

		toggleEdit()
		setChangesSavedMessage('Changes Saved!')
		setTimeout(() => {
			setChangesSavedMessage('')
		}, 2000)
		window.scrollTo(0, 0)
	}

	const openModal = () => {
		setModal(true)
	}

	return (
		<div className='editProfileContainer'>
			<DeleteAccount modal={modal} setModal={setModal} user={user} />
			<div className='card'>
				<div className='card-header'>
					<h3>Edit Profile</h3>
				</div>
				<hr />
				<div className='card-body'>
					<form onSubmit={onSubmitChanges}>
						<div className='form-group'>
							<label htmlFor='name'>Name</label>
							<input
								type='text'
								className='form-control'
								id='name'
								value={user.name}
								onChange={onChange}
								maxLength='18'
							/>
						</div>
						<div className='form-group'>
							<label htmlFor='bio'>Bio</label>
							<textarea
								type='text'
								className='form-control'
								id='bio'
								value={user.bio}
								onChange={onChange}
							/>
						</div>
						<div className='form-group'>
							<input
								type='file'
								id='profilePic'
								onChange={(e) => {
									const file = e.target.files[0]
									if (file) {
										const reader = new FileReader()
										reader.addEventListener('load', (e) => {
											setUser({ ...user, profilePic: e.target.result })
										})
										reader.readAsDataURL(file)
									} else {
										setUser({ ...user, profilePic: '' })
									}
								}}
							/>
						</div>
					</form>
				</div>
				<div className='card-footer'>
					<button onClick={onSubmitChanges} className='btn btn-success'>
						Save changes
					</button>
					<button onClick={openModal} className='btn btn-danger'>
						Delete Account
					</button>
				</div>
			</div>
		</div>
	)
}
