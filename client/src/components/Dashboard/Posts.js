import React, { useState } from 'react'
import placeholderImage from '../../images/placeholderProfileImage.png'

export default function Posts({ user, setUser }) {
	const [postContent, setPostContent] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const onChange = ({ target }) => {
		setPostContent(target.value)
	}

	const fetchPost = async (url, payload) => {
		setLoading(true)
		return await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${localStorage.token}`,
			},
			body: JSON.stringify(payload),
		}).then((res) => res.json())
	}

	const addNewPost = async (e) => {
		e.preventDefault()
		try {
			if (!postContent.trim()) throw Error('Enter content')

			const newPost = {
				postContent,
				profilePic: user.profilePic ? user.profilePic : placeholderImage,
				name: user.name,
				dateCreated: new Date().toLocaleString(),
				likes: 0,
				comments: 0,
			}

			const res = await fetchPost('/data/addPost', newPost)
			setUser({ ...user, posts: [...user.posts, res] })
			setLoading(false)

			setPostContent('')
		} catch (e) {
			setError(e.message)
			setTimeout(() => setError(''), 2000)
		}
	}

	const deletePost = async (date) => {
		const res = await fetchPost('/data/deletePost', { date })
		setUser({ ...user, posts: res })
		setLoading(false)
	}

	return (
		<div className='postsContainer'>
			<div className='card border-0'>
				<div className='card-header' style={{ borderBottom: '3px solid #227EFF' }}>
					<div className='row no-gutters'>
						<div className='col-md-1 d-flex justify-content-center align-items-center'>
							<img
								src={user.profilePic ? user.profilePic : placeholderImage}
								className='rounded-circle'
								style={{ height: '80px', width: '80px', objectFit: 'cover', background: 'grey' }}
								alt=''
							/>
						</div>
						<div className='col-md-11'>
							<form>
								<div className='input-group'>
									<textarea
										value={postContent}
										onChange={onChange}
										name='postContent'
										placeholder='Write a post/nappy...'
										className='form-control border-0 bg-light'
									/>
									<div className='input-group-append'>
										<button disabled={loading} onClick={addNewPost} className='btn btn-primary'>
											Post
										</button>
									</div>
								</div>
							</form>
							<span className='text-danger'>{error}</span>
						</div>
					</div>
				</div>

				<div className='card-body p-0 overflow-auto' style={{ background: '#e6e6e6' }}>
					{user.posts && user.posts.length ? (
						[...user.posts].reverse().map((p, i) => (
							<div key={i} className='card shadow-none rounded-0 mb-3'>
								<div className='card-header d-flex flex-row'>
									<img src={p.profilePic} style={{ maxHeight: '50px' }} alt='' />
									<div className='mx-2'>
										<span className='text-primary'>{p.name}</span>
										<br />
										<small className='text-muted'>{p.dateCreated}</small>
									</div>
									<button
										onClick={() => deletePost(p.dateCreated)}
										type='button'
										className='close text-danger'
										style={{ marginLeft: 'auto' }}
									>
										<span>×</span>
									</button>
								</div>

								<div className='card-body'>
									<p>{p.postContent}</p>

									<small className='text-muted mt-auto'>{p.likes} likes</small>
									<small className='text-muted mt-auto mx-3'>{p.comments} comments</small>
								</div>
							</div>
						))
					) : (
						<h5 className='text-muted p-4'>You have no posts</h5>
					)}
				</div>
			</div>
		</div>
	)
}
