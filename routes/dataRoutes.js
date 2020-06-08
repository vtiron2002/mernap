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

route.post('/addNote', async (req, res) => {
	const email = req.user.email

	await Users.updateOne(
		{ email },
		{
			$push: {
				notes: [req.body],
			},
		},
	)
	res.json(req.body)
})

route.delete('/removeNote', async (req, res) => {
	const email = req.user.email
	const { date } = req.body
	const user = await Users.find({ email })
	const newNotes = user[0].notes.filter((note) => note.created_at !== date)
	await Users.updateOne(
		{ email },
		{
			$set: {
				notes: newNotes,
			},
		},
	)
	res.json(newNotes)
})

route.post('/editProfile', async (req, res) => {
	const { email } = req.user
	const data = req.body

	await Users.updateOne({ email }, { $set: data })
})

route.post('/deleteAccount', async (req, res) => {
	const { id } = req.body
	const result = await Users.findByIdAndDelete({ _id: id })
	res.json({ result })
})

route.post('/addPost', async (req, res) => {
	const email = req.user.email
	await Users.updateOne(
		{ email },
		{
			$push: {
				posts: [req.body],
			},
		},
	)
	res.json(req.body)
})

route.post('/deletePost', async (req, res) => {
	const email = req.user.email
	const { date } = req.body
	const user = await Users.find({ email })
	const newPosts = user[0].posts.filter((post) => post.dateCreated !== date)
	await Users.updateOne(
		{ email },
		{
			$set: {
				posts: newPosts,
			},
		},
	)
	res.json(newPosts)
})

route.post('/getUsers', async (req, res) => {
	const { search } = req.body

	const users = await Users.find()
	const fuse = new Fuse(users, options)
	const foundUsers = fuse.search(search)

	if (!search.toString().trim()) {
		let filteredUsers = []
		users.forEach((user) => {
			const { bio, posts, _id, date_created, name, profilePic } = user
			filteredUsers.push({ bio, posts, _id, date_created, name, profilePic })
		})

		return res.json({ users: filteredUsers })
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

route.post('/getUser', async (req, res) => {
	const { id } = req.body
	const users = await Users.find({ _id: id })
	const user = users[0]
	const { bio, posts, _id, date_created, name, profilePic } = user
	res.json({
		user: {
			bio,
			posts,
			_id,
			date_created,
			name,
			profilePic,
		},
	})
})

route.post('/toggleLike', async (req, res) => {
	const { email } = req.user
	const { date, id, isLiked } = req.body

	const user = await Users.find({ _id: id })
	const userPosts = user[0].posts

	let newPosts

	if (!isLiked) {
		newPosts = userPosts.map((p) =>
			p.dateCreated === date ? { ...p, likes: [...p.likes, email] } : { ...p },
		)
	} else {
		newPosts = userPosts.map((p) =>
			p.dateCreated === date ? { ...p, likes: p.likes.filter((l) => l !== email) } : { ...p },
		)
	}

	Users.updateOne(
		{ _id: id },
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

	await Users.updateOne(
		{ _id },
		{
			$set: {
				posts: newPosts,
			},
		},
	)
	res.json({ newCommentToAdd: newComment })
})

module.exports = route
