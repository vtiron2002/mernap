import React from 'react'
import { Link } from 'react-router-dom'
import { jwtVerify } from '../api/jwtVerify'

export default function Header() {
	const isLoggedIn = jwtVerify(localStorage.token)

	const logout = () => {
		delete localStorage.token
		delete localStorage.email
		window.location.href = '/'
	}

	let open = false
	const toggleMenu = () => {
		if (!open) {
			document.body.style.overflow = 'hidden'
			open = true
		} else {
			document.body.style.removeProperty('overflow')
			open = false
		}
	}

	return (
		<header>
			<div className='container'>
				<Link className='logo' to='/'>
					MERNAP
				</Link>

				{isLoggedIn && (
					<>
						<input type='checkbox' id='check' />
						<label onClick={toggleMenu} htmlFor='check' className='checkbtn'>
							<div className='burger-menu'>
								<div></div>
								<div></div>
								<div></div>
							</div>
						</label>

						<ul>
							<li>
								<a href='/searchUsers'>Search Users</a>
							</li>
							<li className='logout' onClick={logout}>
								Log out
							</li>
						</ul>
					</>
				)}
			</div>
		</header>
	)
}
