import React from 'react'
import placeholderProfileImage from '../images/placeholderProfileImage.png'
import Card from './Card'

export default function ProfileInfo({ user, dashboard = false, toggleEdit, changesSavedMessage }) {
	return (
		<div className='profileInfoContainer'>
			<div className='card'>
				<img src={user.profilePic ? user.profilePic : placeholderProfileImage} alt='profile-pic' />
			</div>

			{/* ///////////////////////////////////////////////////////////////////////////////////////////////// */}

			<Card>
				<div className='card-header'>
					<h3>User Info</h3>
					{dashboard && changesSavedMessage && (
						<span className='text-success'>{changesSavedMessage}</span>
					)}
					{user.followers && (
						<div className='rightSide'>
							<span className='followers'>
								{user.followers.length}{' '}
								{user.followers.length > 1 || user.followers.length === 0 ? 'Followers' : 'Follower'}
							</span>
							<span className='following'>{user.following.length} Following</span>
						</div>
					)}
				</div>
				<hr />

				<div className='card-body'>
					<h5 className='card-title'>{user.name}</h5>
					<p>{user.bio}</p>
				</div>
				<div className='card-footer'>
					{dashboard && (
						<button onClick={toggleEdit} className='btn btn-secondary btn-sm'>
							Edit profile
						</button>
					)}

					<span className='text-muted'>
						Account created: {new Date(user.date_created).toLocaleString()}
					</span>
				</div>
			</Card>
		</div>
	)
}
