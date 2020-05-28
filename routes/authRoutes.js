const express = require('express')
const route = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Users = require('../models/Users')

const createTokenSendRes = async (user, res) => {
	try {
		const token = await jwt.sign({ name: user.name, email: user.email }, process.env.JWT_SECRET, {
			expiresIn: '1h',
		})
		res.json({ token })
	} catch (e) {
		res.json({ err: e.message })
	}
}

route.post('/register', (req, res) => {
	const { name, email, password, confirmPassword } = req.body
	if (password === confirmPassword) {
		Users.find({ email }, (err, result) => {
			if (result.length === 0) {
				bcrypt.hash(password, 10, (err, hashedPassword) => {
					const newUser = {
						name,
						email,
						password: hashedPassword,
					}

					Users.create(newUser, (err, user) => {
						createTokenSendRes(user, res)
					})
				})
			} else {
				res.json({ message: `An account with that email already exists.` })
			}
		})
	} else {
		res.send({ message: `Passwords don't match.` })
	}
})

route.post('/login', async (req, res) => {
	const { email, password } = await req.body

	try {
		if (!email.trim()) throw Error('Email missing')
		if (!password.trim()) throw Error('Password missing')

		const user = await Users.findOne({ email })
		if (!user) throw Error(`There is no account with that email`)

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) throw Error(`Incorrect credentials`)

		createTokenSendRes(user, res)
	} catch (e) {
		res.json({ message: e.message })
	}
})

route.post('/checkJWT', (req, res) => {
	const token = req.body.token
	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) {
				res.json({ err })
			} else {
				res.json({ user })
			}
		})
	}
})

module.exports = route
