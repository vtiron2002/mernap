import React, { useEffect, useState } from 'react'

import { useParams } from 'react-router-dom'
import placeholderProfileImage from '../images/placeholderProfileImage.png'

import { customFetch } from '../api/fetch'

import Loading from '../components/Loading'

export default function User() {
	const [user, setUser] = useState({})
	const [loading, setLoading] = useState(false)

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

	const toggleLike = (data) => {
		const post = user.posts.find((p) => p.dateCreated === data.date)
		const isLiked = post.likes.includes(localStorage.email)
		if (!isLiked) {
			customFetch({ url: '/data/likePost', method: 'POST', body: {...data, posts: user.posts} }).then(({ email }) => {
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
			}).then((res) => setUser({...user, posts: res.newPosts}))
		}
	}

	const isLiked = (date) => {
		const post = user.posts.find((p) => p.dateCreated === date)
		return post.likes.includes(localStorage.email)
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
									<small className='text-muted'>{p.dateCreated}</small>
								</div>
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
					))}
			</div>
		</div>
	)
}
