const customFetch = ({ method = 'GET', body, url, auth = true }) => {
	return fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json',
			authorization: auth && `Bearer ${localStorage.token}`,
		},
		body: JSON.stringify(body),
	}).then((res) => res.json())
}

const homeFetch = async ({ type, setError, setLoading, loginInfo, registerInfo }) => {
	const { message, token } = await customFetch({
		url: `/auth/${type === 'login' ? 'login' : 'register'}`,
		method: 'POST',
		body: type === 'login' ? loginInfo : registerInfo,
		auth: false,
	})
	if (message) {
		setError(message)
		setLoading(false)
	} else {
		localStorage.token = token
		window.location.href = '/dashboard'
	}

	console.log(type)
}

export { customFetch, homeFetch }
