import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import DashboardWrapper from './components/dashboard/wrapper'

import "./client/css/style.css"

var App = React.createClass({

 render: function () {

  return (
   <Router history={browserHistory}>
    <Route path="/dashboard" component={DashboardWrapper} />
   </Router>
  )
 }

})


ReactDOM.render(<App/>,document.getElementById('app'))
