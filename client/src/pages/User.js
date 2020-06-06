import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import placeholderProfileImage from '../images/placeholderProfileImage.png'
import { customFetch } from '../api/fetch'
import Loading from '../components/Loading'
import { toggleLike, isLiked } from '../api/toggleLike'

export default function User() {
	const [user, setUser] = useState({})
	const [loading, setLoading] = useState(false)
	const [newComment, setNewComment] = useState('')

	const { id } = useParams()

	useEffect(() => {
		setLoading(true)
		customFetch({ url: `/data/getUser`, method: 'POST', body: { id } }).then((res) => {
			setUser(res.user)
			setLoading(false)
		})
	}, [])

	const firstName = (name) => {
		if (name === undefined) return null
		document.querySelector('title').innerText = `MERNAP - ${user.name}`
		return name.split(' ')[0]
	}

	const toggleComments = (e) => {
		if (e.target.parentElement.nextSibling.hasAttribute('hidden')) {
			e.target.classList.add('commentsOpen')
			e.target.parentElement.nextSibling.removeAttribute('hidden')
		} else {
			e.target.classList.remove('commentsOpen')
			e.target.parentElement.nextSibling.setAttribute('hidden', '')
		}
	}

	const submitComment = (e, p) => {
		e.preventDefault()
		if (!newComment.trim()) return
		console.log("submited")
		customFetch({ url: '/data/addComment', body: { newComment, _id: user._id, date: p.dateCreated }, method: 'POST' }).then(res => {
			setUser({...user, posts: res.newPosts})
			setNewComment('')
		})
	}

	if (loading) return <Loading />
	return (
		<div className='userContainer container'>
			<div className='userInfo'>
				<div className='card'>
					<img
						src={user.profilePic ? user.profilePic : placeholderProfileImage}
						alt='profile-pic'
					/>
					<div>
						<h5 className='card-title'>{user.name}</h5>
						<div
							style={{
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								maxHeight: '100%',
								maxWidth: '100%',
								whiteSpace: 'nowrap',
							}}
						>
							<span>{user.bio}</span>
						</div>
					</div>
				</div>

				{/* ///////////////////////////////////////////////////////////////////////////////////////////////// */}

				<div className='card'>
					<div className='card-header'>
						<h3>User Info</h3>
					</div>
					<hr />

					<div className='card-body'>
						<h5 className='card-title'>{user.name}</h5>
						<p>{user.bio}</p>
					</div>
					<div className='card-footer'>
						<span className='text-muted'>
							Account created: {new Date(user.date_created).toLocaleString()}
						</span>
					</div>
				</div>
			</div>

			<div className='userPosts'>
				<h4>{firstName(user.name)}'s posts</h4>

				{user.posts &&
					[...user.posts].reverse().map((p, i) => (
						<div key={i} className='post'>
							<div className='postHeader'>
								<img src={user.profilePic ? user.profilePic : placeholderProfileImage} alt='' />
								<div>
									<span>{p.name}</span>
									<br />
									<small className='text-muted'>{new Date(p.dateCreated).toLocaleString()}</small>
								</div>
							</div>

							<div className='postBody'>
								<p>{p.postContent}</p>

								<small
									onClick={() => toggleLike({ id: user._id, date: p.dateCreated, user, setUser })}
									className={`text-muted likes ${
										isLiked({ date: p.dateCreated, user }) && 'liked'
									}`}
								>
									{p.likes.length} {p.likes.length > 1 || p.likes.length === 0 ? 'likes' : 'like'}
								</small>
								<small onClick={toggleComments} className='text-muted comments'>
									{p.comments.length}{' '}
									{p.comments.length > 1 || p.comments.length === 0 ? 'comments' : 'comment'}
								</small>
							</div>

							<div hidden={true} className='postComments'>
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
					))}
			</div>
		</div>
	)
}

const Comment = ({ user }) => {
	const showDate = (dateCreated) => {
		var periods = {
			month: 30 * 24 * 60 * 60 * 1000,
			week: 7 * 24 * 60 * 60 * 1000,
			day: 24 * 60 * 60 * 1000,
			hour: 60 * 60 * 1000,
			minute: 60 * 1000,
		}
		var diff = Date.now() - new Date(dateCreated)

		if (diff > periods.month) {
			// it was at least a month ago
			return Math.floor(diff / periods.month) + 'm'
		} else if (diff > periods.week) {
			return Math.floor(diff / periods.week) + 'w'
		} else if (diff > periods.day) {
			return Math.floor(diff / periods.day) + 'd'
		} else if (diff > periods.hour) {
			return Math.floor(diff / periods.hour) + 'h'
		} else if (diff > periods.minute) {
			return Math.floor(diff / periods.minute) + 'm'
		}
		return 'Just now'
	}

	return (
		<div  className='comment'>
			<div className='commentHeader'>
				<img src={user.profilePic ? user.profilePic : placeholderProfileImage} alt='' />
				<div>
					<a href={`/user/${user._id}`}>{user.name}</a>
					<br />
					<small className='text-muted'>{showDate(user.dateCreated)}</small>
				</div>
			</div>
			<div className='commentBody'>
				<p>{user.content}</p>
			</div>
		</div>
	)
}

export {
	Comment
}