const express = require('express')
require('dotenv').config()
const authRoutes = require('./routes/authRoutes')
const dataRoutes = require('./routes/dataRoutes')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const { checkTokenSetData, isLoggedIn } = require('./middlewares/middlewares')

const app = express()

const port = process.env.PORT || 5000

mongoose.connect(
	process.env.MONGODB_URI || process.env.MONGOOSE_URI,
	{ useUnifiedTopology: true, useNewUrlParser: true },
	() => console.log('Database started'),
)

app.use(express.json())
app.use(morgan('tiny'))

app.use(cors())
app.use(express.urlencoded({ extended: false }))

app.use(checkTokenSetData)
app.use('/auth', authRoutes)
app.use('/data', isLoggedIn, dataRoutes)

app.use(express.static('client/build'))

app.get('*', (req, res) => {
	res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
})

app.listen(port, () => console.log(`Server running on http://localhost:${port}`))

// const express = require('express');
// const path = require('path')

// const app = express()
// const PORT = process.env.PORT || 5000

// if (process.env.NODE_ENV === 'production') {
// 	console.log('build started');
// 	app.use(express.static('client/build'));

// 	app.get('*', (req, res) => {
// 		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
// 	});
// }

// app.listen(PORT, () => console.log(`Sever running on port ${PORT}`))
