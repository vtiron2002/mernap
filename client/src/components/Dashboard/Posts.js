import React, { useState, useContext } from 'react'
import placeholderImage from '../../images/placeholderProfileImage.png'
import { customFetch } from '../../api/fetch'
import { toggleLike, isLiked } from '../../api/toggleLike'
import { UserContext } from '../../UserContext'
import { Comment } from '../../pages/User'

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
			dateCreated: new Date(),
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
						[...user.posts]
							.reverse()
							.map((p, i) => <Post p={p} key={i} user={user} setUser={setUser} />)
					) : (
						<h5 className='text-muted'>You have no posts</h5>
					)}
				</div>
			</div>
		</div>
	)
}

const Post = ({ p, user, setUser, deletePost }) => {
	const [commentsOpen, setCommentsOpen] = useState(false)
	const [newComment, setNewComment] = useState('')

	const submitComment = (e, p) => {
		e.preventDefault()
		if (!newComment.trim()) return
		console.log('submited')
		customFetch({
			url: '/data/addComment',
			body: { newComment, _id: user._id, date: p.dateCreated },
			method: 'POST',
		}).then((res) => {
			setUser({ ...user, posts: res.newPosts })
			setNewComment('')
		})
	}

	return (
		<div className='post'>
			<div className='postHeader'>
				<img src={user.profilePic} alt='' />
				<div>
					<span>{p.name}</span>
					<br />
					<small className='text-muted'>{new Date(p.dateCreated).toLocaleString()}</small>
				</div>
				<button onClick={() => deletePost(p.dateCreated)} type='button'>
					<span>×</span>
				</button>
			</div>

			<div className='postBody'>
				<p>{p.postContent}</p>

				<small
					onClick={() => toggleLike({ id: user._id, date: p.dateCreated, user, setUser })}
					className={`text-muted likes ${isLiked({ date: p.dateCreated, user }) && 'liked'}`}
				>
					{p.likes.length} {p.likes.length > 1 || p.likes.length === 0 ? 'likes' : 'like'}
				</small>
				<small
					onClick={() => setCommentsOpen(!commentsOpen)}
					className={`text-muted comments ${commentsOpen && 'commentsOpen'}`}
				>
					{p.comments.length}{' '}
					{p.comments.length > 1 || p.comments.length === 0 ? 'comments' : 'comment'}
				</small>
			</div>

			<div hidden={!commentsOpen} className='postComments'>
				<form onSubmit={(e) => submitComment(e, p)}>
					<input
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						type='text'
						className='form-control'
						placeholder='Type a comment...'
					/>
				</form>

				<div className='comments'>
					{p.comments.map((c, i) => (
						<Comment key={i} user={c} />
					))}
				</div>
			</div>
		</div>
	)
}
