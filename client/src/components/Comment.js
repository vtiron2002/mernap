import React from 'react'
import placeholderProfileImage from '../images/placeholderProfileImage.png'

const Comment = ({ user }) => {
	const showDate = (dateCreated) => {
		var periods = {
			month: 30 * 24 * 60 * 60 * 1000,
			week: 7 * 24 * 60 * 60 * 1000,
			day: 24 * 60 * 60 * 1000,
			hour: 60 * 60 * 1000,
			minute: 60 * 1000,
		}
		var diff = Date.now() - new Date(dateCreated)

		if (diff > periods.month) {
			// it was at least a month ago
			return Math.floor(diff / periods.month) + 'm'
		} else if (diff > periods.week) {
			return Math.floor(diff / periods.week) + 'w'
		} else if (diff > periods.day) {
			return Math.floor(diff / periods.day) + 'd'
		} else if (diff > periods.hour) {
			return Math.floor(diff / periods.hour) + 'h'
		} else if (diff > periods.minute) {
			return Math.floor(diff / periods.minute) + 'm'
		}
		return 'Just now'
	}

	return (
		<div className='comment'>
			<div className='commentHeader'>
				<img src={user.profilePic ? user.profilePic : placeholderProfileImage} alt='' />
				<div>
					<a href={`/user/${user._id}`}>{user.name}</a>
					<br />
					<small className='text-muted'>{showDate(user.dateCreated)}</small>
				</div>
			</div>
			<div className='commentBody'>
				<p>{user.content}</p>
			</div>
		</div>
	)
}

export default Comment
