import React, { useState, useEffect } from 'react'
import { customFetch } from '../api/fetch'
import Loader from '../components/Loader'
import placeholderPic from '../images/placeholderProfileImage.png'

import { Link } from 'react-router-dom'
import FollowButton from '../components/FollowButton'

export default function SearchUsers() {
	const [users, setUsers] = useState([])
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState('')

	useEffect(() => {
		getUsers()
	}, [])

	useEffect(() => {
		if (users.length !== 0) {
			setMessage(`${users.length} ${users.length === 1 ? 'user' : 'users'} found!`)
		}

		document.querySelector('title').innerText = `MERNAP - Search Users`
	}, [users])

	const getUsers = () => {
		setLoading(true)
		customFetch({ url: '/data/getUsers', method: 'POST', body: { search } }).then((res) => {
			try {
				if (res.message) throw Error(res.message)
				setUsers(res.users)
				setLoading(false)
			} catch (e) {
				setMessage(e.message)
				setLoading(false)
				setTimeout(() => setMessage(''), 2000)
				setUsers([])
			}
		})
	}

	const submitSearch = (e) => {
		e.preventDefault()
		getUsers()
	}

	return (
		<div className='searchUsersContainer container'>
			<div className='card'>
				<div className='card-title'>Search Users</div>
				<form onSubmit={submitSearch}>
					<input
						onChange={({ target }) => setSearch(target.value)}
						value={search}
						type='text'
						className='form-control'
						placeholder="Search a user's name"
					/>
					{message && <h3>{message}</h3>}
					{loading && <Loader />}
				</form>
			</div>
			<div className='users'>
				{users &&
					users.map((u, i) => (
						<Link to={`/user/${u._id}`} key={i} className='card'>
							<img src={u.profilePic ? u.profilePic : placeholderPic} alt='' />
							<div className='info'>
								<span>{u.name}</span>
								<br />
								<div>
									<span>
										{u.followers.length}{' '}
										{u.followers.length > 1 || u.followers.length === 0 ? 'Followers' : 'Follower'}
									</span>
									{u.following.length} Following
								</div>
							</div>
							<FollowButton getUsers={getUsers} user={u} />
						</Link>
					))}
			</div>
		</div>
	)
}
