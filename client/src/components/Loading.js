import React from 'react'
import Loader from '../components/Loader'

export default function Loading() {
	return (
		<div className='container loadingPage'>
			<Loader />
			<a href='/dashboard' className=''>
				Refresh Page
			</a>
		</div>
	)
}
