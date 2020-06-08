import React from 'react'

import './styles/Home.scss'
import Register from '../components/Home/Register'
import Login from '../components/Home/Login'

export default function Home() {
	return (
		<div className='container homeContainer'>
			<Login />
			<Register />
		</div>
	)
}
