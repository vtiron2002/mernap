import React from 'react'
import { Redirect, Link } from 'react-router-dom'

export default function Home() {
	if (!localStorage.token) {
		return (
			<div class='home jumbotron text-center'>
				<h1 class='display-4'>Welcome to "MERNAP"</h1>
				<p class='lead'>
					This is a simple app made from the MERN stack.
					<br /> Made by Valentyn Tiron
				</p>
				<hr class='my-4' />
				<p>
					To use this app, start by <Link to='/register'>creating an account</Link> or
					<Link to='/login'> log in</Link> if you already have an account :)
				</p>
				<Link class='btn btn-success btn-lg mx-1' to='/login'>
					Login
				</Link>
				<Link class='btn btn-warning btn-lg mx-1' to='/register'>
					Register
				</Link>
			</div>
		)
	} else {
		return <Redirect to='/dashboard' />
	}
}
