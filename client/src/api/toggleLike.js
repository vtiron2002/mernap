import { customFetch } from './fetch'

const isLiked = ({ date, user }) => {
	const post = user.posts.find((p) => p.dateCreated === date)
	return post.likes.includes(localStorage.email)
}

const toggleLike = async ({ id, date, user, setUser })  => {
	const body = { id, date, isLiked: isLiked({ date, user }) }
	const {newPosts} = await customFetch({ url: '/data/toggleLike', method: 'POST', body })

	setUser({ ...user, posts: newPosts })
}

export { isLiked, toggleLike }
