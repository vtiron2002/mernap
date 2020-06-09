import React, { useState, createContext } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Header from './components/Header'

import { jwtVerify } from './api/jwtVerify'

import { Dashboard, Home, NotFound, SearchUsers, User } from './pages'

const UserContext = createContext()

const App = () => {
	const [user, setUser] = useState({})
	const [userLoading, setUserLoading] = useState(false)

	const loggedIn = jwtVerify(localStorage.token)

	return (
		<Router>
			<UserContext.Provider value={{ user, setUser, userLoading, setUserLoading }}>
				<Header />
				<Switch>
					<Route exact path='/' render={() => (loggedIn ? <Dashboard /> : <Home />)} />
					<Route
						path='/dashboard'
						render={() => (loggedIn ? <Dashboard /> : <Redirect to='/' />)}
					/>
					<Route
						path='/searchUsers'
						render={() => (loggedIn ? <SearchUsers /> : <Redirect to='/' />)}
					/>
					<Route path='/user/:id' render={() => (loggedIn ? <User /> : <Redirect to='/' />)} />

					<Route path='*' component={NotFound} />
				</Switch>
			</UserContext.Provider>
		</Router>
	)
}

export { App, UserContext }
