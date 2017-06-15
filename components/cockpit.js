import React from 'react'
import {observer} from 'mobx-react'
import FontIcon from 'material-ui/FontIcon'
import {amber600,lightBlue400} from 'material-ui/styles/colors'
import { SpeedDial, BubbleList, BubbleListItem } from 'react-speed-dial'
import Avatar from 'material-ui/Avatar'
import QRCode from 'qrcode.react'
import {translate} from '../client/lang/translation'
import stores from '../stores/vrestores'
import messenger from '../stores/messenger.js'
import Dialog from 'material-ui/Dialog'
import IconButton from 'material-ui/IconButton'
import {Container,Row,Col} from 'react-grid-system'
import TextField from 'material-ui/TextField'
import RaisedButton from 'material-ui/RaisedButton'

const styles = {
  cardboardIcon:{
   left:0,
   right:0,
   margin:"0 auto"
  },
  qrCode:{
    position:"absolute",
    width:"80%",
    margin:"0 auto",
    color:"rgb(117, 117, 117)"
  },
  root:{
   display: 'flex',
   flexWrap: 'wrap'
  },
  pdfBtn:{
    position:"absolute",
    right:0,
    top:0
  },
  pdfIcon:{
    fontSize:"30px !important"
  },
  mailText:{
    marginTop:45
  },
  rckpWrapper:{
    position:"absolute",
    width:"100%",
    height:"100%",
    overflow:"hidden",
    top:0,
    left:0,
    zIndex:1000,
    background:lightBlue400,
    color:'#fff'
  },
  rckpCenter:{
   textAlign:"center",
   position: "fixed",
   top:"50%",
   left: "50%",
   transform: "translate(-50%, -50%)",
   width:"100%"
 },
 rckpCardboardImage:{
   display:"block",
   margin:"0 auto",
   marginBottom:"2%",
   width:"45%",
   maxWidth:500,
   maxHeight:700
 },
 rckpText:{
   padding:10
 }
}


@observer
class ReleaseCockpit extends React.Component {
  render () {
    return (
      <div style={styles.rckpWrapper} className="animated fadeIn">
       <Container>
        <Row>
         <Col lg={2} md={3} sm={0} xs={0}/>
         <Col lg={10} md={9} sm={12} xs={12}>

          <div style={styles.rckpCenter}>
           <p style={styles.rckpText}> {translate("vreditor").youCanNowCockpit} </p>
           <img src="client/images/cardboardGuy.png" style={styles.rckpCardboardImage} />
           <RaisedButton
            primary={true}
            label={translate("vreditor").tryNow}
            onTouchTap={this.onTouchTap}
           />
          </div>

         </Col>
         <Col lg={2} md={3} sm={0} xs={0}/>
        </Row>
       </Container>
      </div>
    )
  }

  onTouchTap () {
    stores.ui.showwhen.setReleaseCockpitAcknowledged()
    setTimeout( () => {
      stores.ui.sharing.handleSpeedDialOpen()
    },1500)
  }

  componentDidMount () {
    window.scrollTo(0, 0)
  }

}

@observer
class Cockpit extends React.Component {
  render () {
    const store = stores.app
    const ui = stores.ui.sharing

    return (
      <span>
       <SpeedDial
        isOpen={ui.speedDialOpen}
        icon={<img src="client/images/cardboard.png" className="cockpit-btn"/>}
        onChange={ui.toggleSpeedDialOpen}
        className="animated jello"
       >

        <BubbleList>

          <BubbleListItem
           primaryText={translate("sharing").qrCode}
           onTouchTap={this.openQRCode}
           rightAvatar={
            <Avatar size={40} backgroundColor={lightBlue400} icon={<FontIcon className="fa fa-qrcode" style={{textAlign:"center"}}></FontIcon>}/>
           }
          />


         <BubbleListItem
          primaryText={translate("sharing").shareEditor}
          rightAvatar={
           <Avatar size={40} backgroundColor={lightBlue400} icon={<FontIcon className="material-icons">picture_as_pdf</FontIcon>}/>
          }
          onTouchTap={this.openAccessData}
         />

         <BubbleListItem
          primaryText={translate("sharing").cardboard}
          onTouchTap={this.goToVR.bind(this)}
          rightAvatar={
           <Avatar size={40} backgroundColor={lightBlue400} icon={<FontIcon className="material-icons">remove_red_eye</FontIcon>}/>
          }
         />

  			</BubbleList>

       </SpeedDial>

       <QRCodeDialog />
       <AccessDataDialog />
      </span>
    )
  }

  openQRCode () {
    const ui = stores.ui.sharing
    ui.handleSpeedDialClose()
    ui.handleOpenQRCode()
  }

  goToVR () {
    window.location = stores.app.getCardboardLink
  }

  openAccessData () {
   const ui = stores.ui.sharing
   ui.handleSpeedDialClose()
   ui.handleAccessDataOpen()
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
       <p> {translate("sharing").scanIt} </p>
       <a href={store.getCardboardLink} target='_new_tab'>
        <QRCode value={store.getCardboardLink} size={256}/>
       </a>
      </div>
     </Dialog>
    )
  }
}

@observer
class AccessDataDialog extends React.Component {
  render () {
    const ui = stores.ui.sharing
    const store = stores.app

    return (
     <Dialog
      title={translate("sharing").shareEditor}
      modal={false}
      open={ui.openAccessData}
      onRequestClose={ui.handleAccessDataClose}
     >
      <AccessDataDialogContent pdfLink={store.getEditorPdfLink} />
     </Dialog>
    )
  }
}

@observer
class AccessDataDialogContent extends React.Component {
  render () {
    const store = stores.ui.sharing
    return (
      <Container>
       <Row>
        <Col>


         <p style={styles.mailText}> {translate("sharing").accessdata} </p>

         <RaisedButton
          label={translate("mail").pdfDownload}
          primary={true}
          icon={<FontIcon className="material-icons">picture_as_pdf</FontIcon>}
          fullWidth={true}
          href={this.props.pdfLink}
         />

         <TextField
          floatingLabelText={translate("mail").email}
          fullWidth={true}
          value={store.mail}
          onChange={this.onMailChange}
          onKeyPress={this.onKeyPress}
         />
         <RaisedButton
          label={translate("mail").send}
          primary={true}
          style={styles.submit}
          icon={<FontIcon className="material-icons">send</FontIcon>}
          fullWidth={true}
          onTouchTap={this.sendMail}
         />
        </Col>
       </Row>
      </Container>
    )
  }

  onMailChange (e,value) {
    stores.ui.sharing.setMail(value)
  }

  onKeyPress (e) {
    if (e.keyCode == 13 || e.which === 13) {
      stores.ui.sharing.sendMail( () => {
        messenger.show(messenger.MESSAGES.mailSent)
      })
      stores.ui.sharing.handleAccessDataClose()
    }
  }

  sendMail = () => {
    stores.ui.sharing.sendMail( () => {
      messenger.show(messenger.MESSAGES.mailSent)
    })
    stores.ui.sharing.handleAccessDataClose()
  }

}



export {Cockpit,ReleaseCockpit}
