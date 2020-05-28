const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const string = { type: String, trim: true };

const User = new Schema({
	name: string,
	bio: { type: String, default: '' },
	profilePic: '',
	email: string,
	password: string,
	date_created: { type: Date, default: Date.now },
	notes: [],
	posts: []
});

module.exports = mongoose.model('users', User);
