import React, { useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'

import { EditProfile, ProfileInfo, Notes, Posts } from '../components/Dashboard'

import { customFetch } from '../api/fetch'

import { UserContext } from '../UserContext'

import Loader from '../components/Loader'
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

		const checkJWT = async () => {
			await customFetch({
				method: 'POST',
				url: '/auth/checkJWT',
				body: { token },
				auth: false,
			}).then((res) => {
				if (res.err) {
					delete localStorage.token
					delete localStorage.email
				}
			})
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
