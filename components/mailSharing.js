import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {deepPurple500,orange500} from 'material-ui/styles/colors'
import {translate} from '../client/lang/translation'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FontIcon from 'material-ui/FontIcon'
import mailsharingstore from '../stores/mailsharingstore'
import messenger from '../stores/messenger.js'


@observer
class ShareMail extends React.Component {
  render () {
    const store = mailsharingstore

    return (
      <Dialog
       title={translate("socialShare").title}
       modal={false}
       open={store.open}
       onRequestClose={store.handleClose}
       autoScrollBodyContent={true}
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
        floatingLabelText={translate("socialShare").toWhom}
        fullWidth={true}
        value={store.toWhom}
        onChange={this.onToWhomChange}
       />
       <TextField
        floatingLabelText={translate("socialShare").fromWho}
        fullWidth={true}
        value={store.fromWho}
        onChange={this.onFromWhoChange}
       />
       <RaisedButton
        label={translate("mail").send}
        primary={true}
        icon={<FontIcon className="material-icons">send</FontIcon>}
        fullWidth={true}
        onTouchTap={this.sendMail}
       />

      </dv>
    )
  }

  sendMail () {
    mailsharingstore.sendMail( () => {
      messenger.mailSent(messenger.MESSAGES.mailSent)
    })
  }

  onToWhomChange (e,value) {
    mailsharingstore.setToWhom(value)
  }

  onFromWhoChange (e,value) {
    mailsharingstore.setFromWho(value)
  }

}

export default
