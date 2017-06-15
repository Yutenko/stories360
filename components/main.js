import React from 'react'

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Header from './header'
import Footer from './footer'
import Messenger from './messenger'

import {amber600,lightBlue400} from 'material-ui/styles/colors'
import stores from '../stores/vrestores'
import {observer} from 'mobx-react'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color:amber600,
    accent1Color:lightBlue400
  }
})


@observer
class Main extends React.Component {

 render () {
  return (
   <MuiThemeProvider muiTheme={muiTheme}>
    <div>
     <Header/>
     {this.props.children}
     <Footer/>
     <Messenger />
    </div>
   </MuiThemeProvider>
  )
 }

}



export default Main
