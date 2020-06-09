import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { customFetch } from '../api/fetch'
import Loading from '../components/Loading'
import Post from '../components/Post'
import ProfileInfo from '../components/ProfileInfo'

export default function User() {
	const [user, setUser] = useState({})
	const [loading, setLoading] = useState(false)

	const { id } = useParams()

	useEffect(() => {
		if (user === undefined) {
			delete localStorage.token
			delete localStorage.email
		}

		setLoading(true)
		getUser()
	}, [])

	const getUser = async () => {
		const res = await customFetch({ url: `/data/getUser`, method: 'POST', body: { id } })
		setUser(res.user)
		setLoading(false)
	}

	const firstName = (name) => {
		if (name === undefined) return null
		document.querySelector('title').innerText = `MERNAP - ${user.name}`
		return name.split(' ')[0]
	}

	if (loading) return <Loading />
	return (
		<div className='userContainer container'>
			<ProfileInfo user={user} />

			<div className='userPosts'>
				<h4>{firstName(user.name)}'s posts</h4>

				{user.posts &&
					[...user.posts]
						.reverse()
						.map((p, i) => <Post key={i} p={p} i={i} user={user} setUser={setUser} />)}
			</div>
		</div>
	)
}
