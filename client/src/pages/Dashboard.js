import React, { useState, useEffect, useContext } from 'react'
import { EditProfile, ProfileInfo, Notes, Posts } from '../components/Dashboard'
import { customFetch } from '../api/fetch'
import { jwtVerify } from '../api/jwtVerify'
import { UserContext } from '../UserContext'

import Loading from '../components/Loading'

export default function Dashboard() {
	const { setUser, setUserLoading, userLoading } = useContext(UserContext)

	const [editProfile, setEditProfile] = useState(false)
	const [changesSavedMessage, setChangesSavedMessage] = useState('')

	useEffect(() => {
		document.querySelector('title').innerText = `MERNAP - Dashboard`
		const { token } = localStorage

		const setUserData = async () => {
			setUserLoading(true)
			await customFetch({ url: '/data/get' }).then(async (user) => {
				if (user.err) {
					return
				} else {
					setUser(user)
					localStorage.email = user.email
				}
			})
			setUserLoading(false)
		}
		setUserData()

		const checkJWT = () => {
			if (!jwtVerify(token)) {
				delete localStorage.token
				delete localStorage.email
				window.location.href = '/'
			}
		}
		checkJWT()
	}, [])

	const toggleEdit = () => {
		setEditProfile(!editProfile)
	}

	if (userLoading) return <Loading />

	return (
		<div className='dashboardContainer container'>
			<ProfileInfo toggleEdit={toggleEdit} changesSavedMessage={changesSavedMessage} />
			{editProfile && (
				<EditProfile toggleEdit={toggleEdit} setChangesSavedMessage={setChangesSavedMessage} />
			)}
			<Posts />
			<Notes />
		</div>
	)
}
