import React, { useState, useContext } from 'react'
import placeholderImage from '../../images/placeholderProfileImage.png'
import { customFetch } from '../../api/fetch'
import { UserContext } from '../../UserContext'

export default function Posts() {
	const {user, setUser} = useContext(UserContext)

	const [postContent, setPostContent] = useState('')

	const onChange = ({ target }) => {
		setPostContent(target.value)
	}

	const addNewPost = async (e) => {
		e.preventDefault()
		const newPost = {
			postContent,
			profilePic: user.profilePic ? user.profilePic : placeholderImage,
			name: user.name,
			dateCreated: new Date().toLocaleString(),
			likes: 0,
			comments: 0,
		}

		await customFetch({
			url: '/data/addPost',
			body: newPost,
			method: 'POST',
		}).then((res) => {
			setUser({ ...user, posts: [...user.posts, res] })
		})

		setPostContent('')
	}

	const deletePost = async (date) => {
		await customFetch({
			url: '/data/deletePost',
			body: { date },
			method: 'POST',
		}).then((res) => {
			setUser({ ...user, posts: res })
		})
	}

	return (
		<div className='postsContainer'>
			<div className='card border-0'>
				<div className='card-header' style={{ borderBottom: '3px solid #227EFF' }}>
					<div className='d-flex align-items-stretch'>
						<img
							src={user.profilePic ? user.profilePic : placeholderImage}
							className='rounded-circle'
							style={{ height: '80px', width: '80px', objectFit: 'cover', background: 'grey' }}
							alt=''
						/>
						<form className='flex-fill'>
							<div className='input-group h-100'>
								<textarea
									value={postContent}
									onChange={onChange}
									name='postContent'
									placeholder={'Write a post...'}
									className={`form-control border-0 bg-light`}
									style={{ outline: 'none' }}
								/>
								<div className='input-group-append'>
									<button
										disabled={!postContent.trim()}
										onClick={addNewPost}
										className='btn btn-primary'
									>
										Post
									</button>
								</div>
							</div>
						</form>
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
