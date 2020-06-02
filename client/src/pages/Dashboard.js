import React, { useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'

import { EditProfile, ProfileInfo, Notes, Posts } from '../components/Dashboard'

import { customFetch } from '../api/fetch'

import { UserContext } from '../UserContext'

import Loader from '../components/Loader'

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
			}).then((res) => res.err && delete localStorage.token)
		}
		checkJWT()
	}, [])

	const toggleEdit = () => {
		setEditProfile(!editProfile)
	}

	// if (localStorage.token) {
	if (userLoading) {
		return (
			<div className='container loadingPage'>
				<Loader />
				<a href='/dashboard' className='btn btn-success mt-4 text-white'>
					Refresh Page
				</a>
			</div>
		)
	} else {
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
	// } else {
	// return <Redirect to='/' />
	// }
}
