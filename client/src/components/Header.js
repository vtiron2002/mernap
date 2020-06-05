import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'

import Loader from '../components/Loader'

export default function Header() {
	const { user, userLoading } = useContext(UserContext)

	const logout = () => {
		delete localStorage.token
		window.location.href = '/'
	}

	return (
		<header>
			<div className='container'>
				{/* <Link to='/'>MERNAP</Link>
				{localStorage.token && (
					<div className='rightSide'>
						{userLoading ? <Loader /> : <span>{user.name}</span>}

						<button onClick={logout} className='logout'>
							Log out
						</button>
					</div>
				)} */}

				<Link className='logo' to='/'>
					MERNAP
				</Link>

				{localStorage.token && (
					<>
						<input type='checkbox' id='check' />
						<label for='check' class='checkbtn'>
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
							<li class='logout' onClick={logout}>
								Log out
							</li>
						</ul>
					</>
				)}
			</div>
		</header>
	)
}
