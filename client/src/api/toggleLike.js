import { customFetch } from './fetch'

const isLiked = ({ date, user }) => {
	const post = user.posts.find((p) => p.dateCreated === date)
	return post.likes.includes(localStorage.email)
}

const toggleLike = ({ id, date, user, setUser }) => {
	const body = { id, date, posts: user.posts }

	if (!isLiked({ date, user })) {
		customFetch({
			url: '/data/likePost',
			method: 'POST',
			body,
		}).then(({ newPosts }) => {
			setUser({ ...user, posts: newPosts })
		})
	} else {
		customFetch({
			url: '/data/unlikePost',
			method: 'POST',
			body,
		}).then((res) => setUser({ ...user, posts: res.newPosts }))
	}
}

export { isLiked, toggleLike }
