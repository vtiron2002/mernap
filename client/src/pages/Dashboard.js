import React, { useState, useEffect, useContext } from 'react'
import { EditProfile, Notes, Posts } from '../components/Dashboard'
import ProfileInfo from '../components/ProfileInfo'
import { customFetch } from '../api/fetch'
import { jwtVerify } from '../api/jwtVerify'
import { UserContext } from '../UserContext'

import Loading from '../components/Loading'

export default function Dashboard() {
	const { user, setUser, setUserLoading, userLoading } = useContext(UserContext)

	const [editProfile, setEditProfile] = useState(false)
	const [changesSavedMessage, setChangesSavedMessage] = useState('')

	useEffect(() => {
		document.querySelector('title').innerText = `MERNAP - Dashboard`
		const { token } = localStorage

		const setUserData = async () => {
			setUserLoading(true)
			const user = await customFetch({ url: '/data/get' })
			if (user.err) {
				return
			} else {
				setUser(user)
				localStorage.email = user.email
			}
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
			<ProfileInfo
				dashboard
				toggleEdit={toggleEdit}
				changesSavedMessage={changesSavedMessage}
				user={user}
			/>
			{editProfile && (
				<EditProfile toggleEdit={toggleEdit} setChangesSavedMessage={setChangesSavedMessage} />
			)}
			<Posts />
			<Notes />
		</div>
	)
}
