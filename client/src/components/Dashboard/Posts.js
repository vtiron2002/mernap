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
			name: user.name,
			dateCreated: new Date().toLocaleString(),
			likes: [],
			comments: [],
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

	const isLiked = (date) => {
		const post = user.posts.find((p) => p.dateCreated === date)
		return post.likes.includes(localStorage.email)
	}

	const toggleLike = (data) => {
		const post = user.posts.find((p) => p.dateCreated === data.date)
		const isLiked = post.likes.includes(localStorage.email)
		if (!isLiked) {
			customFetch({
				url: '/data/likePost',
				method: 'POST',
				body: { ...data, posts: user.posts },
			}).then(({ email }) => {
				const posts = user.posts.map(
					(p) => p.dateCreated === data.date ? { ...p, likes: [...p.likes, email] } : {...p},
				)
				setUser({ ...user, posts })
			})
		} else {
			customFetch({
				url: '/data/unlikePost',
				method: 'POST',
				body: { ...data, posts: user.posts },
			}).then((res) => setUser({ ...user, posts: res.newPosts }))
		}
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
									<img src={user.profilePic} alt='' />
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

									<small
										onClick={() => toggleLike({ id: user._id, date: p.dateCreated })}
										className={`text-muted likes ${isLiked(p.dateCreated) && 'liked'}`}
									>
										{p.likes.length} {p.likes.length > 1 || p.likes.length === 0 ? 'likes' : 'like'}
									</small>
									<small className='text-muted comments'>{p.comments.length} comments</small>
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
