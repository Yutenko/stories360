import React from 'react'
import {observer} from 'mobx-react'
import stores from '../stores/vrestores'
import messenger from '../stores/messenger.js'
import {Container,Row,Col} from 'react-grid-system'
import {translate} from '../client/lang/translation'
import {deepPurple500} from 'material-ui/styles/colors'
import Paper from 'material-ui/Paper'
import Toggle from 'material-ui/Toggle'
import {List, ListItem} from 'material-ui/List'
import {Card, CardHeader, CardText, CardMedia, CardTitle, CardActions} from 'material-ui/Card'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'
import TextField from 'material-ui/TextField'
import QRCode from 'qrcode.react'
import IconButton from 'material-ui/IconButton'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {lightBlue400} from 'material-ui/styles/colors'

const styles = {
 headSection:{
  color:"#fff"
 },
 paper:{
   padding:10
  },
  backgroundImageHint:{
   textAlign:"center",
   paddingTop:175,
   fontSize:"200%",
   color:"rgba(200,200,200,.5)"
  },
  backgroundImageTap:{
   position:"absolute",
   transform: "rotate(320deg)",
   fontSize: "500%",
   right:0,
   color:"rgba(200,200,200,.5)"
 },
 root:{
  display: 'flex',
  flexWrap: 'wrap'
 },
 qrCode:{
   position:"absolute",
   width:"80%",
   margin:"0 auto",
   color:"rgb(117, 117, 117)"
 },
 publishButton:{
   width:"100%"
 },
 publishCardboardButton:{

 },
 divider:{
   marginTop:20,
   marginBottom:20
 }
}

@observer
class SharingEditor extends React.Component {
  render () {
    const store = stores.app
    const ui = stores.ui.sharing

    let styleList = {}, styleListItem = {}
    if (store.public) {
      styleList = {backgroundColor:lightBlue400}
      styleListItem = {color:'#fff'}
    }

    return (
      <section style={styles.headSection}>
        <Container>
         <Row>
          <Col md={12}>
            <Card style={{marginBottom:30}}>
             <CardText>

               <List>
                <ListItem
                 primaryText={translate("sharing").embed}
                 leftIcon={<FontIcon className="material-icons">code</FontIcon>}
                 onTouchTap={ui.handleOpenEmbed}
                />
               </List>

               <Divider style={styles.divider}/>
               <p style={{textAlign:"center"}}> {translate("sharing").publishNote} </p>
               <List style={styleList}>
                <ListItem
                style={styleListItem}
                 primaryText={store.getPublishNote}
                 rightToggle={
                  <Toggle
                   defaultToggled={!!+store.public}
                   onToggle={this.onToggle.bind(this)}
                  />
                 }
                />
              </List>

             </CardText>
            </Card>
          </Col>
         </Row>
        </Container>

       <QRCodeDialog />
       <EmbedCodeDialog />

      </section>
    )
  }

  goToVR () {
    window.location = stores.app.getCardboardLink
  }

  showMessage () {
    messenger.show(messenger.MESSAGES.pdfIsCreated)
  }

  onToggle (e,value) {
    stores.app.setPublic(value)
  }
}

@observer
class EmbedCodeDialog extends React.Component {
  render () {
    const ui = stores.ui.sharing
    const store = stores.app

    return (
      <Dialog
          title={translate("sharing").embed}
          modal={false}
          open={ui.openEmbed}
          onRequestClose={ui.handleCloseEmbed}
        >
         <div>
          <p> {translate("sharing").embedExplained} </p>
          <TextField
           defaultValue={store.getEmbedCode}
           fullWidth={true}
           multiLine={true}
           autoFocus={true}
           rows={2}
           id="embedcode"
           onFocus={this.handleFocus}
          />
         </div>
        </Dialog>
    )
  }

  handleFocus (event) {
    event.target.select()
  }
}

@observer
class QRCodeDialog extends React.Component {
  render () {
    const ui = stores.ui.sharing
    const store = stores.app

    return (
     <Dialog
      modal={false}
      open={ui.openQRCode}
      onRequestClose={ui.handleCloseQRCode}
     >
      <div style={{textAlign:"center"}}>
       <QRCode value={store.getCardboardLink} size={256}/>
      </div>
     </Dialog>
    )
  }
}

@observer
class PublishDialog extends React.Component {
  render () {
    const ui = stores.ui.sharing
    const store = stores.app

    return (
     <Dialog
      title={store.publishTitle}
      modal={false}
      open={ui.openPublish}
      onRequestClose={ui.handleClosePublish}
     >
      <div>
       <p> {translate("sharing").publishNote} </p>
       <RaisedButton
        href={store.getCardboardLink}
        icon={<img src="client/images/cardboard_black.svg" style={{width:27,height:16.6}}/>}
        label={translate("sharing").cardboard}
        style={styles.publishCardboardButton}
        fullWidth={true}
       />
       <Divider style={styles.divider}/>
       <List>
         <ListItem
          primaryText={store.getPublishNote}
          rightToggle={
            <Toggle
             defaultToggled={!!+store.public}
             onToggle={this.onToggle.bind(this)}
            />
          }
         />
       </List>
      </div>
     </Dialog>
    )
  }

}





export {SharingEditor}


// <ListItem
//  primaryText={translate("sharing").cardboard}
//  rightIconButton={
//    <IconButton onTouchTap={ui.handleOpenQRCode}>
//     <FontIcon className="fa fa-qrcode" ></FontIcon>
//    </IconButton>
//  }
//  leftIcon={<img src="client/images/cardboard_black.svg" style={{width:27,height:16.6}}/>}
//  onTouchTap={this.goToVR.bind(this)}
// />
// <Divider />
// <ListItem
//  primaryText={translate("sharing").shareEditor}
//  leftIcon={<FontIcon className="material-icons">picture_as_pdf</FontIcon>}
//  href={store.getEditorPdfLink}
//  onTouchTap={this.showMessage}
// />
// <Divider />
