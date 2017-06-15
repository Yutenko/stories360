import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {deepPurple500,orange500,blue500} from 'material-ui/styles/colors'
import TextField from 'material-ui/TextField'
import {translate} from '../client/lang/translation'
import {observer} from 'mobx-react'
import stores from '../stores/vrestores'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import ReactFitText from 'react-fittext'

const styles = {
 headSection:{
  backgroundColor:blue500,
  height:400,
  color:"#fff"
 },
 centerMe:{
   textAlign:"center"
 },
 container:{
   cursor:"pointer"
 },
 textfield:{
   position:"absolute",
   width:"100%",
   height:400,
   overflow:"hidden"
 }
}

@observer
class Description extends React.Component {
  render () {
   const ui = stores.ui.description

   return (
    <section style={styles.headSection}>
      <Container style={styles.container}>
       <Row>
        <Col md={12}>
        <div onTouchTap={ui.handleOpen.bind(this)} style={styles.textfield}>
         <Title />
         <Subtitle />
         <DescriptionDialog />
         </div>
        </Col>
       </Row>
      </Container>
     </section>
   )
  }
}

@observer
class Title extends React.Component {
  render () {
   const app = stores.app
   const title = app.title && app.title !== "" ? app.title : translate("vreditor").title

   return (
     <ReactFitText compressor={1.5} minFontSize={40}>
      <h1 style={styles.centerMe}> {title} </h1>
     </ReactFitText>
   )
  }
}

@observer
class Subtitle extends React.Component {
  render () {
   const app = stores.app
   const subtitle = app.subtitle && app.subtitle !== "" ? app.subtitle : translate("vreditor").subtitle

   return (
    <ReactFitText compressor={2.5} minFontSize={20}>
     <p style={styles.centerMe}> {subtitle} </p>
    </ReactFitText>
   )
  }
}

@observer
class DescriptionDialog extends React.Component {
  render () {
    const ui = stores.ui.description

    return (
      <Dialog
       title={translate("vreditor").description}
       modal={false}
       open={ui.open}
       onRequestClose={this.onRequestClose}
      >
       <DescriptionDialogContent />
      </Dialog>
    )
  }

  onRequestClose () {
    stores.ui.description.handleClose()
    stores.app.updateDescriptionServer()
  }
}


@observer
class DescriptionDialogContent extends React.Component {
  render () {
    const app = stores.app
    return (
      <div>

        <TextField
         hintText={translate("vreditor").title}
         fullWidth={true}
         onChange={this.onChangeTitle}
         value={app.title}
         onKeyPress={this.leaveDialog}
        />

        <TextField
         hintText={translate("vreditor").subtitle}
         fullWidth={true}
         onChange={this.onChangeSubtitle}
         value={app.subtitle}
         onKeyPress={this.leaveDialog}
        />

      </div>
     )
  }

  leaveDialog (event) {
    if (event.keyCode === 13 || event.which === 13) {
      stores.ui.description.handleClose()
      stores.app.updateDescriptionServer()
    }
  }

  onChangeTitle (e,value) {
   stores.app.updateTitle(value)
  }

  onChangeSubtitle (e,value) {
   stores.app.updateSubtitle(value)
  }


}


export default Description
