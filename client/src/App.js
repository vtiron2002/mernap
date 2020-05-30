import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Header from './components/Header'

import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'

import { UserContext } from './UserContext'

export default function App() {
	const [user, setUser] = useState({})
	const [userLoading, setUserLoading] = useState(false)

	useEffect(() => {
		console.log('APP LOADED')
	}, [])

	return (
		<Router>
			<UserContext.Provider value={{ user, setUser, userLoading, setUserLoading }}>
				<Header />

				<Switch>
					<Route exact path='/'>
						<Home />
					</Route>
					<Route path='/register'>
						<Register />
					</Route>
					<Route path='/login'>
						<Login />
					</Route>
					<Route exact path='/dashboard'>
						<Dashboard  />
					</Route>
					{/* <Route path='/test'>
					<Test user={user} />
				</Route> */}
				</Switch>
			</UserContext.Provider>
		</Router>
	)
}
