import React, { useState, useContext } from 'react'
import placeholderImage from '../../images/placeholderProfileImage.png'
import { customFetch } from '../../api/fetch'
import { UserContext } from '../../UserContext'

export default function Posts() {
	const { user, setUser } = useContext(UserContext)

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
			<div className='card'>
				<div>
					<img src={user.profilePic ? user.profilePic : placeholderImage} alt='' />

					<form>
						<textarea
							value={postContent}
							onChange={onChange}
							name='postContent'
							placeholder={'Write a post...'}
							className='form-control'
						/>
						<button disabled={!postContent.trim()} onClick={addNewPost}>
							Post
						</button>
					</form>
				</div>

				<div>
					{user.posts && user.posts.length ? (
						[...user.posts].reverse().map((p, i) => (
							<div key={i} className='post'>
								<div className='postHeader'>
									<img src={p.profilePic} alt='' />
									<div>
										<span>{p.name}</span>
										<br />
										<small className='text-muted'>{p.dateCreated}</small>
									</div>
									<button onClick={() => deletePost(p.dateCreated)} type='button'>
										<span>×</span>
									</button>
								</div>

								<div className='postBody'>
									<p>{p.postContent}</p>

									<small className='text-muted'>{p.likes} likes</small>
									<small className='text-muted'>{p.comments} comments</small>
								</div>
							</div>
						))
					) : (
						<h5 className='text-muted'>You have no posts</h5>
					)}
				</div>
			</div>
		</div>
	)
}
