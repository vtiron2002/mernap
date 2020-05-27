import React, { useState } from 'react'
import DeleteAccount from './DeleteAccount'
// import placeholderProfileImage from '../images/placeholderProfileImage.png';

export default function EditProfile({ user, setUser, setChangesSavedMessage, toggleEdit }) {
	const [modal, setModal] = useState(false)

	const onChange = (e) => {
		setUser({ ...user, [e.target.id]: e.target.value })
	}

	const onSubmitChanges = (e) => {
		e.preventDefault()
		fetch('/data/editProfile', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${localStorage.token}`,
			},
			body: JSON.stringify(user),
		})
			.then((res) => res.json())
			.then()

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
		<>
			<div className='editProfileContainer'>
				<DeleteAccount modal={modal} setModal={setModal} user={user} />
				<div className='card h-100'>
					<div className='card-header'>Edit Profile</div>
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
							<div className='input-group mb-3'>
								<div className='input-group-prepend'>
									<span className='input-group-text' id='inputGroupFileAddon01'>
										Profile Picture
									</span>
								</div>
								<div className='custom-file'>
									<input
										type='file'
										className='custom-file-input'
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
									<label className='custom-file-label' htmlFor='inputGroupFile01'>
										Choose file
									</label>
								</div>
							</div>
						</form>
						<div className='d-flex justify-content-between align-items-center'>
							<button onClick={onSubmitChanges} className='btn btn-success'>
								Save changes
							</button>
							<button onClick={openModal} className='btn btn-danger'>
								Delete Account
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
