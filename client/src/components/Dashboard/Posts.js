import React, { useState, useContext } from 'react'
import placeholderImage from '../../images/placeholderProfileImage.png'
import { customFetch } from '../../api/fetch'
import { UserContext } from '../../UserContext'
import Post from '../Post'

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

		const res = await customFetch({
			url: '/data/addPost',
			body: newPost,
			method: 'POST',
		})
		setUser({ ...user, posts: [...user.posts, res] })

		setPostContent('')
	}

	const deletePost = async (date) => {
		const posts = await customFetch({
			url: '/data/deletePost',
			body: { date },
			method: 'POST',
		})
		setUser({ ...user, posts })
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
							.map((p, i) => (
								<Post
									p={p}
									key={i}
									user={user}
									setUser={setUser}
									deletePost={deletePost}
									dashboard
								/>
							))
					) : (
						<h5 className='text-muted'>You have no posts</h5>
					)}
				</div>
			</div>
		</div>
	)
}
