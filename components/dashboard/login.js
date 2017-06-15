import React from 'react'
import {lightBlue400,amber600} from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper'
import {translate} from '../../client/lang/translation'
import {observer} from 'mobx-react'
import TextField from 'material-ui/TextField'
import DashboardStore from '../../stores/dashboardstore'
import RaisedButton from 'material-ui/RaisedButton'

const styles = {
  wrapper:{
    textAlign:"center",
    position: "fixed",
    top:"50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width:300,
    padding:50
  },
  section:{
    position:"absolute",
    backgroundColor:lightBlue400,
    width:"100%",
    height:"100%",
    overflow:"hidden"
  }
}

@observer
class DashboardLogin extends React.Component {
  render () {
    const store = DashboardStore
    return (
      <section style={styles.section}>
       <Paper style={styles.wrapper}>
        <TextField
         floatingLabelText={translate("dashboard").userlogin}
         id="user-id"
         value={store.user}
         onKeyPress={this.onKeyPress}
         onChange={this.setUser}
         fullWidth={true}
        />
        <TextField
         floatingLabelText={translate("dashboard").password}
         id="pw-id"
         value={store.pw}
         onKeyPress={this.onKeyPress}
         onChange={this.setPW}
         type="password"
         fullWidth={true}
        />
        <RaisedButton
         label="Login"
         onTouchTap={this.login}
         primary={true}
         fullWidth={true}
        />
       </Paper>
      </section>
    )
  }

  setUser (e,value) {
    DashboardStore.setUser(value)
  }

  setPW (e,value) {
    DashboardStore.setPW(value)
  }

  onKeyPress (e) {
    if (e.keyCode === 13 || e.which === 13) {
      DashboardStore.login()
    }
  }

  login () {
    DashboardStore.login()
  }
}


export default DashboardLogin
