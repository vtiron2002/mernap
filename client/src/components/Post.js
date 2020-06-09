import React, { useState, useEffect } from 'react'
import { toggleLike, isLiked } from '../api/toggleLike'
import Comment from '../components/Comment'
import { customFetch } from '../api/fetch'
import placeholderImage from '../images/placeholderProfileImage.png'

const Post = ({ p, user, setUser, deletePost, dashboard = false }) => {
	const [commentsOpen, setCommentsOpen] = useState(false)
	const [newCommentContent, setNewCommentContent] = useState('')

	const submitComment = (e, p) => {
		e.preventDefault()
		if (!newCommentContent.trim()) return

		const newComment = {
			name: user.name,
			email: user.email,
			content: newCommentContent,
			dateCreated: new Date(),
		}

		customFetch({
			url: '/data/addComment',
			body: { newComment, _id: user._id, date: p.dateCreated },
			method: 'POST',
		}).then(({email}) => newComment.email === email)

		console.log(newComment)

		const newPosts = user.posts.map((post) =>
			post.dateCreated === p.dateCreated
				? { ...post, comments: [...post.comments, newComment] }
				: { ...post },
		)
		setUser({ ...user, posts: newPosts })
		setNewCommentContent('')
	}

	return (
		<div className='post'>
			<div className='postHeader'>
				<img src={user.profilePic ? user.profilePic : placeholderImage} alt='' />
				<div>
					<span>{p.name}</span>
					<br />
					<small className='text-muted'>{new Date(p.dateCreated).toLocaleString()}</small>
				</div>

				{dashboard && (
					<button onClick={() => deletePost(p.dateCreated)} type='button'>
						<span>×</span>
					</button>
				)}
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

			{commentsOpen && (
				<div className='postComments'>
					<form onSubmit={(e) => submitComment(e, p)}>
						<input
							value={newCommentContent}
							onChange={(e) => setNewCommentContent(e.target.value)}
							type='text'
							className='form-control'
							placeholder='Type a comment...'
						/>
					</form>

					<div className='comments'>
						{[...p.comments].reverse().map((c, i) => (
							<Comment key={i} user={c} />
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default Post
