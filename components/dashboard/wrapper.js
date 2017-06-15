import React from 'react'
import {observer} from 'mobx-react'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import DashboardStore from '../../stores/dashboardstore'
import {lightBlue400,amber600} from 'material-ui/styles/colors'

import DashboardLogin from './login'
import Dashboard from './dashboard'

injectTapEventPlugin();

const muiTheme = getMuiTheme({
  palette: {
    primary1Color:amber600,
    accent1Color:lightBlue400
  }
})

@observer
class DashboardWrapper extends React.Component {
  render () {
    const store = DashboardStore
    return (
     <MuiThemeProvider muiTheme={muiTheme}>
      <div>
       {store.isLoggedIn && <Dashboard />}
       {!store.isLoggedIn && <DashboardLogin />}
      </div>
     </MuiThemeProvider>
    )
  }
}


export default DashboardWrapper
