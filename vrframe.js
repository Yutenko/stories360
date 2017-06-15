import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'
import VRFrameScene from './components/vrframescene'

import "./client/css/style.css"

var App = React.createClass({

 render: function () {

  return (
   <Router history={browserHistory}>
    <Route path="/watch" component={VRFrameScene} />
   </Router>
  )
 }

})


ReactDOM.render(<App/>,document.getElementById('app'))
