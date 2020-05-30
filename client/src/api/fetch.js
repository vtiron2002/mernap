export const customFetch = async ({ method = 'GET', body, url, auth = true }) => {
	return await fetch(url, {
		method,
		headers: {
			'Content-Type': 'application/json',
			authorization: auth && `Bearer ${localStorage.token}`,
		},
		body: JSON.stringify(body),
	}).then((res) => res.json())
}
