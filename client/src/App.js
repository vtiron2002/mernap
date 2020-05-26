import React, { useState, useEffect } from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect,
} from 'react-router-dom';
import Header from './components/Header';

import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

export default function App() {
	const [user, setUser] = useState({});

	useEffect(() => {
		if (localStorage.token) {
			fetch('/data/get', {
				headers: {
					authorization: `Bearer ${localStorage.token}`,
				},
			})
				.then((res) => res.json())
				.then((user) => {
					setUser(user);
					console.log('got user data!')
				});
		}
	}, []);

	return (
		<Router>
			<Header usersName={user.name} />
			<Switch>
				<Route path='/register'>
					{localStorage.token ? <Redirect to='/dashboard' /> : <Register />}
				</Route>
				<Route path='/login'>
					{localStorage.token ? <Redirect to='/dashboard' /> : <Login />}
				</Route>
				<Route exact path='/dashboard'>
					{localStorage.token ? (
						<Dashboard user={user} setUser={setUser} />
					) : (
						<Redirect to='/login' />
					)}
				</Route>
			</Switch>
		</Router>
	);
}
