const jwt = require('jsonwebtoken')

const checkTokenSetData = (req, res, next) => {
  const authHeader = req.get('authorization');
	if (authHeader) {
    const token = authHeader.split(' ')[1];
		if (token) {
			jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
				if (err) {
					console.log(err)
					res.json({err})
				}

				req.user = user;
				next();
			});
		} else {
			next();
		}
	} else {
    next();
	}
};


const isLoggedIn = (req, res, next) => {
	if (req.user) {
		next();
	} else {
		res.json({ message: '🚫 Not logged in 🚫' });

	}
};

module.exports = {
	checkTokenSetData,
	isLoggedIn,
};
