import React, { useContext } from 'react'
// import { Link } from 'react-router-dom';
import placeholderProfileImage from '../../images/placeholderProfileImage.png'
import { UserContext } from '../../UserContext'

export default function ProfileInfo({ toggleEdit, changesSavedMessage }) {
	const { user } = useContext(UserContext)

	return (
		<>
			<div className='profileInfoContainer'>
				<div className='card'>
					<img
						src={user.profilePic ? user.profilePic : placeholderProfileImage}
						alt='profile-pic'
					/>
					<div>
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

				<div className='card'>
					<div className='card-header'>
						<h3>User Info</h3>
						{changesSavedMessage && <span className='text-success'>{changesSavedMessage}</span>}
					</div>
					<hr />

					<div className='card-body'>
						<h5 className='card-title'>{user.name}</h5>
						<p>{user.bio}</p>
					</div>
					<div className='card-footer'>
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
