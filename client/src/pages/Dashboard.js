import React, { useState, useEffect, useContext } from 'react'
import { Redirect } from 'react-router-dom'
import EditProfile from '../components/Dashboard/EditProfile'
import ProfileInfo from '../components/Dashboard/ProfileInfo'
import Notes from '../components/Dashboard/Notes'
import Posts from '../components/Dashboard/Posts'

import { customFetch } from '../api/fetch'

import { UserContext } from '../UserContext'

export default function Dashboard() {
	const { setUser, setUserLoading, userLoading } = useContext(UserContext)

	const [editProfile, setEditProfile] = useState(false)
	const [changesSavedMessage, setChangesSavedMessage] = useState('')

	useEffect(() => {
		document.querySelector('title').innerText = `MERNAP - Dashboard`
		const { token } = localStorage

		const setUserData = async () => {
			setUserLoading(true)
			await customFetch({ url: '/data/get' }).then((user) => {
				setUser(user)
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
	}, [setUser, setUserLoading])

	const toggleEdit = () => {
		setEditProfile(!editProfile)
	}

	if (localStorage.token) {
		if (userLoading) {
			return (
				<div className='container py-4 h-100 text-center d-flex flex-column align-items-center justify-content-center'>
					<div
						style={{ height: '100px', width: '100px' }}
						className='spinner-border text-primary '
						role='status'
					>
						<span className='sr-only'>Loading...</span>
					</div>
					<a href='/dashboard' className='btn btn-success mt-4 text-white'>
						Refresh Page
					</a>
				</div>
			)
		} else {
			return (
				<div className='dashboardContainer'>
					<ProfileInfo toggleEdit={toggleEdit} changesSavedMessage={changesSavedMessage} />
					{editProfile && (
						<EditProfile toggleEdit={toggleEdit} setChangesSavedMessage={setChangesSavedMessage} />
					)}
					<Posts />
					<Notes />
				</div>
			)
		}
	} else {
		return <Redirect to='/login' />
	}
}
