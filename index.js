import "babel-polyfill"

import injectTapEventPlugin from 'react-tap-event-plugin'

import "./client/css/style.css"
import "./node_modules/animate.css/animate.min.css"

import "./node_modules/react-dropzone-component/styles/filepicker.css"
import "./node_modules/dropzone/dist/min/dropzone.min.css"
import "./node_modules/react-grid-layout/css/styles.css"
import "./node_modules/react-resizable/css/styles.css"

import "./node_modules/wavesurfer.js/dist/wavesurfer.min.js"


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, browserHistory} from 'react-router'

import Main from './components/main'
import VREditor from './components/vreditor'
import Start from './components/start'
import Stories360About from './components/about'
import Stories360Impressum from './components/impressum'
import Stories360Privacy from './components/privacy'
import Stories360Tos from './components/tos'
import Stories360Mail from './components/mail'
import Stories360Tips from './components/tips'
import Stories360Lesson from './components/lesson'

import {translate} from './client/lang/translation'

class App extends React.Component {

 render () {
  return (
   <Router history={browserHistory}>
    <Route component={Main} path="/">
     <IndexRoute component={Start} />
     <Route path="vreditor" component={VREditor} />
     <Route path="about" component={Stories360About} />
     <Route path="impressum" component={Stories360Impressum} />
     <Route path="privacy" component={Stories360Privacy} />
     <Route path="tos" component={Stories360Tos} />
     <Route path="mail" component={Stories360Mail} />
     <Route path="tips" component={Stories360Tips} />
     <Route path="lesson" component={Stories360Lesson} />
    </Route>
   </Router>
  )
 }

 componentWillMount () {
   document.title = translate("global").stories360
 }

}


ReactDOM.render(<App/>,document.getElementById('app'))
