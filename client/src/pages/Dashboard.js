import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import EditProfile from '../components/Dashboard/EditProfile'
import ProfileInfo from '../components/Dashboard/ProfileInfo'
import Notes from '../components/Dashboard/Notes'

export default function Dashboard({ user, setUser, userLoading }) {
	const [newNote, setNewNote] = useState({
		name: '',
		note: '',
	})
	const [noteError, setNoteError] = useState('')
	const [editProfile, setEditProfile] = useState(false)
	const [changesSavedMessage, setChangesSavedMessage] = useState('')

	useEffect(() => {
		const token = localStorage.token
		fetch('/auth/checkJWT', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify({ token }),
		})
			.then((res) => res.json())
			.then((res) => {
				if (res.err) {
					delete localStorage.token
				}
			})
	}, [])

	const onChange = (e) => {
		setNewNote({ ...newNote, [e.target.id]: e.target.value })
	}

	const addNewNote = (e) => {
		e.preventDefault()
		if (!newNote.name.trim('') || !newNote.note.trim('')) {
			setNoteError('Fill both out')
		} else {
			const body = {
				...newNote,
				created_at: new Date(),
			}
			fetch('/data/addNote', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
					authorization: `Bearer ${localStorage.token}`,
				},
				body: JSON.stringify(body),
			})
				.then((res) => res.json())
				.then((res) => {
					setUser({ ...user, notes: [...user.notes, res] })
				})
			setNewNote({
				name: '',
				note: '',
			})
			setNoteError('')
		}
	}

	const removeNote = (date) => {
		fetch('/data/removeNote', {
			method: 'DELETE',
			headers: {
				'content-type': 'application/json',
				authorization: `Bearer ${localStorage.token}`,
			},
			body: JSON.stringify({ date }),
		})
			.then((res) => res.json())
			.then((res) => setUser({ ...user, notes: res }))
	}

	const toggleEdit = () => {
		setEditProfile(!editProfile)
	}

	if (localStorage.token) {
		if (userLoading) {
			return (
				<div className='container mt-4 text-center'>
					<div
						style={{ height: '100px', width: '100px' }}
						className='spinner-border text-primary '
						role='status'
					>
						<span className='sr-only'>Loading...</span>
					</div>
				</div>
			)
		} else {
			return (
				<div className='container my-4 d-flex flex-column justify-content-center align-items-center p-0'>
					<ProfileInfo
						user={user}
						toggleEdit={toggleEdit}
						changesSavedMessage={changesSavedMessage}
					/>

					{editProfile && (
						<EditProfile
							user={user}
							setUser={setUser}
							setChangesSavedMessage={setChangesSavedMessage}
							toggleEdit={toggleEdit}
						/>
					)}

					<Notes
						user={user}
						removeNote={removeNote}
						addNewNote={addNewNote}
						noteError={noteError}
						onChange={onChange}
						newNote={newNote}
					/>
				</div>
			)
		}
	} else {
		return <Redirect to='/login' />
	}
}
