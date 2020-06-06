const express = require('express')
const route = express.Router()
const Fuse = require('fuse.js')
const options = {
	keys: ['name'],
	distance: 5,
	findAllMatches: true,
	minMatchCharLength: 3,
}

const Users = require('../models/Users')

route.get('/get', async (req, res) => {
	const email = req.user.email

	const user = await Users.findOne({ email })
	res.json(user)
})

route.post('/addNote', (req, res) => {
	const email = req.user.email
	const newNote = {
		...req.body,
	}

	Users.find({ email }, (err, prevUser) => {
		Users.updateOne(
			{ email },
			{
				$push: {
					notes: [newNote],
				},
			},
			(err, result) => {
				if (result) {
					// res.json({newNote})
				}
			},
		)
		res.json(newNote)
	})
})

route.delete('/removeNote', (req, res) => {
	const email = req.user.email
	const date = req.body.date
	Users.findOne({ email }, (err, user) => {
		const oldNotes = user.notes
		const newNotes = oldNotes.filter((note) => note.created_at !== date)
		Users.updateOne(
			{ email },
			{
				$set: {
					notes: newNotes,
				},
			},
			(err, result) => {},
		)
		res.json(newNotes)
	})
})

route.post('/editProfile', (req, res) => {
	const email = req.user.email
	const data = req.body

	Users.updateOne({ email }, { $set: data }, (err, result) => {
		if (err) {
			res.json(err)
		} else {
			res.json(result)
		}
	})
})

route.post('/deleteAccount', (req, res) => {
	const { id } = req.body
	console.log(id)
	Users.deleteOne({ _id: id }, (err, result) => {
		if (err) {
			console.log('err', err)
		} else {
			res.json({ status: 'ok' })
		}
	})
})

route.post('/addPost', (req, res) => {
	const email = req.user.email
	const newPost = {
		...req.body,
	}

	Users.find({ email }, (err, prevUser) => {
		Users.updateOne(
			{ email },
			{
				$push: {
					posts: [newPost],
				},
			},
			(err, result) => {
				if (result) {
					// res.json({newNote})
				}
			},
		)
		res.json(newPost)
	})
})

route.post('/deletePost', (req, res) => {
	const email = req.user.email
	const { date } = req.body
	Users.findOne({ email }, (err, user) => {
		const oldPosts = user.posts
		const newPosts = oldPosts.filter((post) => post.dateCreated !== date)
		Users.updateOne(
			{ email },
			{
				$set: {
					posts: newPosts,
				},
			},
			(err, result) => {},
		)
		res.json(newPosts)
	})
})

route.post('/getUsers', (req, res) => {
	const { search } = req.body

	Users.find((err, users) => {
		const fuse = new Fuse(users, options)
		const foundUsers = fuse.search(search)

		if (!search.toString().trim()) {
			let filterdUsers = []
			users.forEach((user) => {
				const { bio, posts, _id, date_created, name, profilePic } = user
				filterdUsers.push({ bio, posts, _id, date_created, name, profilePic })
			})

			return res.json({ users: filterdUsers })
		}

		if (foundUsers.length === 0)
			return res.json({
				message: `There are no users with the search term "${search}"`,
			})

		let newFoundUsers = []
		foundUsers.forEach((user) => {
			const { bio, notes, posts, _id, date_created, name, profilePic } = user.item
			newFoundUsers.push({ bio, notes, posts, _id, date_created, name, profilePic })
		})

		res.json({ users: newFoundUsers })
	})
})

route.post('/getUser', (req, res) => {
	const { id } = req.body
	Users.findOne({ _id: id }, (err, user) => {
		const { bio, posts, _id, date_created, name, profilePic } = user
		const filteredUser = {
			bio,
			posts,
			_id,
			date_created,
			name,
			profilePic,
		}

		res.json({ user: filteredUser })
	})
})

route.post('/likePost', (req, res) => {
	const { email } = req.user
	const { date, id, posts } = req.body

	const newPosts = posts.map((p) =>
		p.dateCreated === date ? { ...p, likes: [...p.likes, email] } : { ...p },
	)

	Users.updateOne(
		{ _id: id },
		{
			$set: {
				posts: [...newPosts],
			},
		},
		(err, result) => {
			res.json({ email, newPosts })
		},
	)
})

route.post('/unlikePost', (req, res) => {
	const { email } = req.user
	const { date, id, posts } = req.body

	const currentPost = posts.find((p) => p.dateCreated === date)

	const filteredLikes = currentPost.likes.filter((l) => l !== email)

	const newPosts = posts.map((p) =>
		p.dateCreated === date ? { ...p, likes: filteredLikes } : { ...p },
	)

	Users.updateOne(
		{ _id: id },
		{
			$set: {
				posts: [...newPosts],
			},
		},
		(err, result) => {
			res.json({ newPosts })
		},
	)
})

route.post('/addComment', async (req, res) => {
	const { email, name } = req.user

	const { _id, date } = req.body

	const sender = await Users.find({ email })
	const id = sender[0]._id
	const profilePic = sender[0].profilePic

	const reciever = await Users.find({ _id })
	const prevPosts = reciever[0].posts

	const newComment = {
		_id: id,
		name,
		email,
		profilePic,
		content: req.body.newComment,
		dateCreated: new Date(),
	}

	const newPosts = prevPosts.map((p) =>
		p.dateCreated === date ? { ...p, comments: [...p.comments, newComment] } : { ...p },
	)


	Users.updateOne(
		{ _id },
		{
			$set: {
				posts: newPosts,
			},
		},
		(err, result) => {
			res.json({ newPosts })
		},
	)
})

module.exports = route
