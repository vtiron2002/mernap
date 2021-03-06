const express = require('express')
const route = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const validator = require('validator')

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

route.post('/register', async (req, res) => {
	const { name, email, password, confirmPassword } = await req.body

	try {
		if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim())
			throw Error('Please fill out all fields.')
		if (!name.trim()) throw Error('Name is missing.')
		if (!validator.isEmail(email)) throw Error(`Email isn't valid.`)
		if (password !== confirmPassword) throw Error(`Passwords don't match.`)
		if (password.length < 8) throw Error('Password must be at least 8 characters.')

		const user = await Users.findOne({ email })
		if (user) throw Error('An account with that email already exists. Log in instead.')

		const hashedPassword = await bcrypt.hashSync(password, 10)
		const newUser = {
			name,
			email,
			password: hashedPassword,
		}
		Users.create(newUser, (err, user) => {
			createTokenSendRes(user, res)
		})
	} catch (e) {
		res.json({ message: e.message })
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

module.exports = route
