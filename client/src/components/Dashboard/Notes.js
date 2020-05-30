import React, { useContext, useState } from 'react'
import { UserContext } from '../../UserContext'
import { customFetch } from '../../api/fetch'

export default function Notes() {
	const { user, setUser } = useContext(UserContext)

	const [newNote, setNewNote] = useState({
		name: '',
		note: '',
	})

	const onChange = ({ target: { id, value } }) => {
		setNewNote({ ...newNote, [id]: value })
	}

	const addNewNote = async (e) => {
		e.preventDefault()
		const body = {
			...newNote,
			created_at: new Date(),
		}
		await customFetch({ method: 'POST', body, url: '/data/addNote' }).then((res) =>
			setUser({ ...user, notes: [...user.notes, res] }),
		)
		setNewNote({
			name: '',
			note: '',
		})
	}

	const removeNote = async (date) => {
		await customFetch({
			method: 'DELETE',
			body: { date },
			url: '/data/removeNote',
		}).then((res) => setUser({ ...user, notes: res }))
	}

	return (
		<>
			<div className='noteContainer'>
				<div className='card h-100'>
					<div className='card-header d-flex justify-content-between align-items-center'>
						<div>New note</div>
					</div>

					<div className='card-body'>
						<form className='d-flex flex-column h-100' onSubmit={addNewNote}>
							<input
								type='text'
								className='form-control mb-2'
								placeholder='Note name'
								value={newNote.name}
								id='name'
								onChange={onChange}
							/>
							<textarea
								type='text'
								className='form-control mb-2 flex-fill'
								placeholder='Note'
								value={newNote.note}
								id='note'
								onChange={onChange}
							/>
							<button
								disabled={!newNote.name.trim() || !newNote.note.trim()}
								className='btn btn-success'
							>
								Add
							</button>
						</form>
					</div>
				</div>

				<div className='card h-100'>
					<div className='card-header d-flex justify-content-between align-items-center'>
						<h5>Your notes</h5>
						<h4 className='m-0'>
							{user.notes && <span className='badge badge-primary'>{user.notes.length}</span>}
						</h4>
					</div>
					<div className='card-body overflow-auto'>
						{user.notes && user.notes.length === 0 && (
							<span className='text-muted'>You have no notes.. make some!</span>
						)}

						{user.notes &&
							[...user.notes].reverse().map((n) => (
								<div key={n.created_at} className='card bg-light p-2 mb-2'>
									<div className='d-flex justify-content-between align-items-center'>
										<h6 className='m-0'>{n.name}</h6>
										<button
											onClick={() => removeNote(n.created_at)}
											className='btn btn-danger btn-sm'
										>
											&times;
										</button>
									</div>

									<hr className='my-2' />
									<p>{n.note}</p>
									<hr className='my-2' />

									<span className='text-muted'>
										created: {new Date(n.created_at).toLocaleString()}
									</span>
								</div>
							))}
					</div>
				</div>
			</div>
		</>
	)
}
