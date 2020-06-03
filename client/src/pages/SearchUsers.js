import React, { useState, useEffect } from 'react'
import { customFetch } from '../api/fetch'
import Loader from '../components/Loader'
import placeholderPic from '../images/placeholderProfileImage.png'

import { Link } from 'react-router-dom'

export default function SearchUsers() {
	const [users, setUsers] = useState([])
	const [search, setSearch] = useState('')
	const [loading, setLoading] = useState(false)
	const [message, setMessage] = useState('')

	useEffect(() => {
		if (users.length !== 0) {
			setMessage(`${users.length} ${users.length === 1 ? 'user' : 'users'} found!`)
		}
	}, [users])

	const submitSearch = (e) => {
		setLoading(true)
		e.preventDefault()
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
								<div>
									<span>{u.bio}</span>
								</div>
							</div>
						</Link>
					))}
			</div>
		</div>
	)
}
