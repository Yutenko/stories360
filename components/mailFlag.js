import React from 'react'
import {observer} from 'mobx-react'
import {Container,Row,Col} from 'react-grid-system'
import {deepPurple500,orange500} from 'material-ui/styles/colors'
import {translate} from '../client/lang/translation'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FontIcon from 'material-ui/FontIcon'
import vrscenemoreui from '../stores/vrscenemoreui'
import messenger from '../stores/messenger.js'
import Dialog from 'material-ui/Dialog'


@observer
class FlagMail extends React.Component {
  render () {
    const store = vrscenemoreui

    return (
      <Dialog
       title={translate("socialShare").flag}
       modal={false}
       open={store.flagDialogOpen}
       onRequestClose={store.handleCloseFlagDialog}
       >
        <DialogContent store={store} />
      </Dialog>
    )
  }
}



@observer
class DialogContent extends React.Component {
  render () {
    const store = this.props.store

    return (
      <div>

        <TextField
         floatingLabelText={translate("socialShare").reason}
         rows={4}
         rowsMax={5}
         fullWidth={true}
         value={store.message}
         onChange={this.onMessageChange}
        />

       <RaisedButton
        label={translate("mail").send}
        primary={true}
        icon={<FontIcon className="material-icons">send</FontIcon>}
        fullWidth={true}
        onTouchTap={this.sendMail}
       />

      </div>
    )
  }

 onMessageChange = (e,value) => {
   this.props.store.setMessage(value)
 }

 sendMail = () => {
   this.props.store.handleCloseFlagDialog()
   this.props.store.flagScene( () => {
     messenger.show(messenger.MESSAGES.mailSent)

   })
 }

}

export default FlagMail
