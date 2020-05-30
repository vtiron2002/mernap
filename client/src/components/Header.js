import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../UserContext'

export default function Header() {
	const {user, userLoading} = useContext(UserContext)
	
	const logout = () => {
		delete localStorage.token
		window.location.href = '/login'
	}

	return (
		<nav className='navbar fixed-top navbar-dark bg-primary text-white'>
			<div className='container d-flex justify-content-between align-items-center'>
				<Link className='navbar-brand' to='/'>
					MERNAP
				</Link>
				{localStorage.token && (
					<div className='d-flex align-items-center'>
						{userLoading ? (
							<div className='spinner-border text-light mr-4' role='status'>
								<span className='sr-only'>Loading...</span>
							</div>
						) : (
							<h6 className='m-0 mr-3'>{user.name}</h6>
						)}

						<button onClick={logout} className='btn btn-danger'>
							Log out
						</button>
					</div>
				)}
			</div>
		</nav>
	)
}
