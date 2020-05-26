const express = require('express');
const route = express.Router();

const Users = require('../models/Users');

route.get('/get', async (req, res) => {
	const email = req.user.email;

	Users.find({ email }, (err, userInfo) => {
		res.json(userInfo[0]);
	});
});

route.post('/addNote', (req, res) => {
	const email = req.user.email;
	const newNote = {
		...req.body,
	};

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
		);
		res.json(newNote);
	});
});

route.delete('/removeNote', (req, res) => {
	const email = req.user.email;
	const date = req.body.date;
	Users.findOne({ email }, (err, user) => {
		const oldNotes = user.notes;
		const newNotes = oldNotes.filter((note) => note.created_at !== date);
		Users.updateOne(
			{ email },
			{
				$set: {
					notes: newNotes,
				},
			},
			(err, result) => {},
		);
		res.json(newNotes);
	});
});

route.post('/editProfile', (req, res) => {
	const email = req.user.email;
	const data = req.body;

	Users.updateOne({ email }, { $set: data }, (err, result) => {
		if (err) {
			res.json(err);
		} else {
			res.json(result);
		}
	});
});

module.exports = route;
