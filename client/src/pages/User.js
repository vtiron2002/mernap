import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import placeholderProfileImage from '../images/placeholderProfileImage.png'

import { customFetch } from '../api/fetch'

export default function User() {
	const [user, setUser] = useState({})
	const [loading, setLoading] = useState(false)

	const { id } = useParams()

	useEffect(() => {
		setLoading(true)
		customFetch({ url: `/data/getUser`, method: 'POST', body: { id } }).then(
			(res) => setUser(res.user),
			setLoading(false),
		)
	}, [])

	return (
		<div className='userContainer container'>
			<div className='card'>
				<img src={user.profilePic ? user.profilePic : placeholderProfileImage} alt='profile-pic' />
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
				</div>
				<hr />

				<div className='card-body'>
					<h5 className='card-title'>{user.name}</h5>
					<p>{user.bio}</p>
				</div>
				<div className='card-footer'>
					<span className='text-muted'>
						Account created: {new Date(user.date_created).toLocaleString()}
					</span>
				</div>
			</div>
		</div>
	)
}
