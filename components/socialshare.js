import React from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'
import {toJS} from 'mobx'
import {Container,Row,Col} from 'react-grid-system'
import vrsceneuistore from '../stores/vrsceneuistore'
import vrscenemorestore from '../stores/vrscenemoreui'
import {ShareButtons,generateShareIcon} from 'react-share'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import RaisedButton from 'material-ui/RaisedButton'
import {translate} from '../client/lang/translation'
import QRCode from 'qrcode.react'
import stores from '../stores/vrestores'
import CopyToClipboard from 'react-copy-to-clipboard'
import messenger from '../stores/messenger.js'


const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton
} = ShareButtons

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const TelegramIcon = generateShareIcon('telegram');
const WhatsappIcon = generateShareIcon('whatsapp');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const PinterestIcon = generateShareIcon('pinterest');
const VKIcon = generateShareIcon('vk');
const OKIcon = generateShareIcon('ok');

const styles = {
 shareButton:{
  display:"inline-block",
  cursor:"pointer",
  margin:5
 },
 contentContainer:{
  backgroundRepeat:"no-repeat",
  backgroundPosition:"center center",
  backgroundSize:"cover",
  textAlign:"center"
 },
 qrCode: {
  marginTop:-15
 },
 spacer:{
  margin:10
 }
}

@observer
class SocialShare extends React.Component {
  render () {
    const ui = vrscenemorestore

    return (
      <Dialog
         title={translate("socialShare").title}
         modal={false}
         open={ui.sharingDialogOpen}
         onRequestClose={ui.handleShareingDialogClosed}
         autoScrollBodyContent={true}
       >
        <SocialShareContent />
       </Dialog>
    )
  }
}

@observer
class SocialShareContent extends React.Component {
  render () {
    return (
     <div style={styles.contentContainer}>
      <SocialButtonSection />
      <QRCodeSection />
      <CopyButtonsSection />
     </div>
    )
  }
}

@observer
class SocialButtonSection extends React.Component {
  render () {
    const store = stores.app
    const title = store.title,
          description = store.subtitle,
          image = 'http://stories360.org/' + (store.backgroundimage && store.backgroundimage.path !== '' ? store.backgroundimage.thumbnail : "client/images/logo.png"),
          url = window.location.href,
          via = "",
          hashtags = "#stories360.org",
          size = 50,
          round = true

    return (
       <Container style={styles.spacer}>
        <Row>
         <Col lg={12} md={12} sm={12} xs={12}>

          <FacebookShareButton title={title} url={url} description={description} picture={image} style={styles.shareButton}>
           <FacebookIcon size={size} round={round} />
          </FacebookShareButton>

          <TwitterShareButton title={title} url={url} style={styles.shareButton}>
           <TwitterIcon size={size} round={round} />
          </TwitterShareButton>

          <GooglePlusShareButton url={url} style={styles.shareButton}>
           <GooglePlusIcon size={size} round={round} />
          </GooglePlusShareButton>

         </Col>
        </Row>
       </Container>
    )
  }
}

@observer
class QRCodeSection extends React.Component {
  render () {
    return (
     <div style={styles.spacer}>
      <QRCode value={window.location.href} size={220} style={styles.qrCode}/>
     </div>
    )
  }
}

@observer
class CopyButtonsSection extends React.Component {
  render () {
    const embedCode = '<iframe src="'+window.location.href+'" frameborder="0" width="100%" height="500px" allowfullscreen mozallowfullscreen></iframe>'

    return (
      <Container style={styles.spacer}>
       <Row>
        <Col lg={6} md={6} sm={12} xs={12}>
          <CopyToClipboard text={window.location.href}>
           <RaisedButton
            label={translate("socialShare").direct}
            icon={<FontIcon className="material-icons">link</FontIcon>}
            onTouchTap={this.showMessage.bind(this,messenger.MESSAGES.directLinkCopied)}
           />
          </CopyToClipboard>
        </Col>
        <Col lg={6} md={6} sm={12} xs={12}>
          <CopyToClipboard text={embedCode}>
           <RaisedButton
            label={translate("socialShare").embed}
            icon={<FontIcon className="material-icons">code</FontIcon>}
            onTouchTap={this.showMessage.bind(this,messenger.MESSAGES.embedCopied)}
           />
          </CopyToClipboard>
        </Col>
       </Row>
      </Container>
    )
  }

  showMessage (msg) {
    messenger.show(msg)
  }
}



export default SocialShare
