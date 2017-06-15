import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {deepPurple500,orange500} from 'material-ui/styles/colors'
import {translate} from '../client/lang/translation'
import Paper from 'material-ui/Paper'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'
import FontIcon from 'material-ui/FontIcon'
import {observer} from 'mobx-react'
import mailStore from '../stores/mailstore'
import messenger from '../stores/messenger.js'

const styles = {
  paper:{
    padding:50
  },
  submit:{
    marginTop:30
  }
}

@observer
class Stories360Mail extends React.Component {
  render () {
    const store = mailStore
    return (
      <Container>
       <Row>
        <Col lg={3} md={2} sm={0} xs={0}/>
        <Col lg={6} md={10} sm={12} xs={12}>

          <h2 className="menu-sites-title menu-sites-text"> {translate("header").mail} </h2>

          <p className="menu-sites-subheader menu-sites-text"> {translate("mail").writeUs} </p>
          <p className="menu-sites-text"> {translate("mail").description} </p>

          <Paper zDepth={1} style={styles.paper}>

           <TextField
            floatingLabelText={translate("mail").name}
            fullWidth={true}
            value={store.name}
            onChange={this.onNameChange}
           />
           <TextField
            floatingLabelText={translate("mail").email}
            fullWidth={true}
            value={store.mail}
            onChange={this.onMailChange}
           />
           <TextField
            floatingLabelText={translate("mail").message}
            rows={4}
            rowsMax={5}
            fullWidth={true}
            value={store.message}
            onChange={this.onMessageChange}
           />

           <RaisedButton
            label={translate("mail").send}
            primary={true}
            style={styles.submit}
            icon={<FontIcon className="material-icons">send</FontIcon>}
            fullWidth={true}
            onTouchTap={this.sendMail}
           />

          </Paper>


         </Col>
         <Col lg={3} md={2} sm={0} xs={0}/>
        </Row>
       </Container>
    )
  }

  onNameChange = (e,value) => {
    mailStore.name = value
  }

  onMailChange = (e,value) => {
    mailStore.mail = value
  }

  onMessageChange = (e,value) => {
    mailStore.message = value
  }

  sendMail = () => {
    mailStore.sendMail( () => {
      messenger.show(messenger.MESSAGES.mailSent)
    })
  }

}


export default Stories360Mail
