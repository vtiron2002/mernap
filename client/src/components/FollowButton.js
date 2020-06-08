import React, { useState, useEffect } from 'react'
import { customFetch } from '../api/fetch'

export default function FollowButton({ user, getUsers }) {
	const [following, setFollowing] = useState(false)

	useEffect(() => {
		setFollowing(checkFollowing())
	}, [])

	const { email } = localStorage
	const follow = async (e) => {
		e.preventDefault()
		await customFetch({
			url: '/data/toggleFollow',
			body: { selectedUserId: user._id, isFollowing: checkFollowing() },
			method: 'POST',
		}).then(({ result }) => {
			getUsers()
			if (result === 'Followed') {
				setFollowing(true)
			} else {
				setFollowing(false)
			}
		})
	}

	const checkFollowing = () => {
		const { followers } = user
		return !!followers.find((f) => f === email)
	}

	const showButton = () => {
		return user.email === email
	}

	if (showButton()) return null
	return (
		<button onClick={follow} className='followButton'>
			<ion-icon name={`person-${!following ? 'add' : 'remove'}`}></ion-icon>
			<span>{!following ? 'follow' : 'unfollow'}</span>
		</button>
	)
}
