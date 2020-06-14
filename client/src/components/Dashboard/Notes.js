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
			<div className='notesContainer'>
				<div className='card'>
					<div className='notesHeader'>
						<div>New note</div>
					</div>

					<div className='card-body'>
						<form className='' onSubmit={addNewNote}>
							<input
								type='text'
								className='form-control'
								placeholder='Note name'
								value={newNote.name}
								id='name'
								onChange={onChange}
							/>
							<textarea
								type='text'
								className='form-control'
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

				<div className='card'>
					<div>
						<h5>Your notes</h5>
						{user.notes && <span className='badge badge-primary'>{user.notes.length}</span>}
					</div>
					<div className='notesBody'>
						{user.notes && user.notes.length === 0 && (
							<h4 className='text-muted'>You have no notes.. make some!</h4>
						)}

						{user.notes &&
							[...user.notes].reverse().map((n, i) => (
								<React.Fragment key={i}>
									<div className='note'>
										<div className='noteHeader'>
											<span>{n.name}</span>
											<button onClick={() => removeNote(n.created_at)}>×</button>
										</div>

										<p>{n.note}</p>

										<span className='text-muted'>{new Date(n.created_at).toLocaleString()}</span>
									</div>
									<hr />
								</React.Fragment>
							))}
					</div>
				</div>
			</div>
		</>
	)
}
