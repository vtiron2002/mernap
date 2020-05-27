import React from 'react'
import {render} from 'react-dom'

import App from './App'

// import './styles/bootswatch.min.css'
import './styles/custom.css'
import 'bootstrap/dist/css/bootstrap.min.css'

render(
  <App />,
  document.querySelector('#root')
)