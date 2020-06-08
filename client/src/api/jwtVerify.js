import jwt from 'jsonwebtoken'

const jwtVerify = (token) => {
	try {
		if (!token) throw Error()
		const result = jwt.verify(token, 'dawoidhawdhawkdjwhdkjafkbfkajwbdkjawbdkjawbdkaw')
		return result
	} catch (e) {
		return false
	}
}

export { jwtVerify }
