import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ usersName }) {
	const logout = () => {
		delete localStorage.token;
		window.location.href = '/login';
	};

	return (
		<nav className='navbar navbar-dark bg-primary text-white'>
			<div className='container d-flex justify-content-between align-items-center'>
				<Link className='navbar-brand' to='/dashboard'>
					MERNAP
				</Link>
				{localStorage.token && (
					<div className='d-flex align-items-center'>
						<h6 className='m-0 mr-3'>{usersName}</h6>
						<button onClick={logout} className='btn btn-danger'>
							Log out
						</button>
					</div>
				)}
			</div>
		</nav>
	);
}