import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'


export default function Header() {
	const { user, userLoading } = useContext(UserContext)

	const logout = () => {
		delete localStorage.token
		delete localStorage.email
		window.location.href = '/'
	}

	let open = false
	const toggleMenu = () => {
		if (!open) {
			document.querySelector('body').style.overflow = 'hidden'
			open = true
		} else {
			document.querySelector('body').style.removeProperty('overflow')
			open = false
		}
	}

	return (
		<header>
			<div className='container'>
				<Link className='logo' to='/'>
					MERNAP
				</Link>

				{localStorage.token && (
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
