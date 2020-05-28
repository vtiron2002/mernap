import React from 'react'
import Posts from '../components/Dashboard/Posts'

export default function Test({user}) {
  return (
    <div className="dashboardContainer">
      <Posts user={user} />
    </div>
  )
}
