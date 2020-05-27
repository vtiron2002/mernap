import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './components/Header'

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
	const [user, setUser] = useState({})
	const [userLoading, setUserLoading] = useState(false)

	useEffect(() => {
		setUserLoading(true)
		if (localStorage.token) {
			fetch('/data/get', {
				headers: {
					authorization: `Bearer ${localStorage.token}`,
				},
			})
				.then((res) => res.json())
				.then((user) => {
					setUser(user)
					setUserLoading(false)
				})
		}
	}, [])

	return (
		<Router>
			<Header usersName={user.name} />
			<Switch>
				<Route path='/register'>
					<Register />
				</Route>
				<Route path='/login'>
					<Login />
				</Route>
				<Route exact path='/dashboard'>
					<Dashboard user={user} setUser={setUser} userLoading={userLoading} />
				</Route>
			</Switch>
		</Router>
	)
}
