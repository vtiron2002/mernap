import React from 'react'
// import { Link } from 'react-router-dom';
import placeholderProfileImage from '../../images/placeholderProfileImage.png'

export default function ProfileInfo({ user, toggleEdit, changesSavedMessage }) {
	return (
		<>
			<div className='profileInfoContainer'>
				<div className='card h-100 overflow-hidden'>
					<img
						style={{ objectFit: 'cover', maxHeight: '250px', minHeight: '200px' }}
						src={user.profilePic ? user.profilePic : placeholderProfileImage}
						alt='profile-pic'
					/>
					<div className='card-body'>
						<h5 className='card-title'>{user.name}</h5>
						<div
							style={{
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								maxHeight: '100%',
								maxWidth: '100%',
								whiteSpace: 'nowrap',
							}}
						>
							<span>{user.bio}</span>
						</div>
					</div>
				</div>

				{/* ///////////////////////////////////////////////////////////////////////////////////////////////// */}

				<div className='card h-100'>
					<div className='card-header d-flex justify-content-between align-items-center'>
						<span>User Info</span>

						{changesSavedMessage && <span className='text-success'>{changesSavedMessage}</span>}
					</div>

					<div className='card-body overflow-auto'>
						<h5 className='card-title'>{user.name}</h5>
						<p>{user.bio}</p>
					</div>
					<div className='card-footer d-flex align-items-center justify-content-between'>
						<button onClick={toggleEdit} className='btn btn-secondary btn-sm'>
							Edit profile
						</button>
						<span className='text-muted'>
							Account created: {new Date(user.date_created).toLocaleString()}
						</span>
					</div>
				</div>
			</div>
		</>
	)
}
