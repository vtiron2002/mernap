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
				<Link to='/'>MERNAP</Link>
				{localStorage.token && (
					<div className='rightSide'>
						{userLoading ? <Loader /> : <span>{user.name}</span>}

						<button onClick={logout} className='logout'>
							Log out
						</button>
					</div>
				)}
			</div>
		</header>
	)
}
