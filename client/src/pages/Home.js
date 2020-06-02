import React from 'react'
import { Redirect, Link } from 'react-router-dom'

import './styles/Home.scss'
import Register from '../components/Home/Register'
import Login from '../components/Home/Login'

export default function Home() {
	// if (!localStorage.token) {
	return (
		<div className='container homeContainer'>
			<Login />
			<Register />
		</div>
	)
	// } else {
	// return <Redirect to='/dashboard' />
	// }
}
