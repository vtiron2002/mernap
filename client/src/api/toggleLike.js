import { customFetch } from './fetch'

const isLiked = ({ date, user }) => {
	const post = user.posts.find((p) => p.dateCreated === date)
	return post.likes.includes(localStorage.email)
}

const toggleLike = ({ id, date, user, setUser }) => {
	const body = { id, date, isLiked: isLiked({ date, user }) }

	customFetch({ url: '/data/toggleLike', method: 'POST', body }).then(({ newPosts }) =>
		setUser({ ...user, posts: newPosts }),
	)
}

export { isLiked, toggleLike }
