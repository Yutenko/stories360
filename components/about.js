import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {translate} from '../client/lang/translation'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon'
import YouTube from 'react-youtube'

const styles = {
  paperPerson:{
   padding:20,
   textAlign:"center"
  },
  person:{
   backgroundRepeat:"no-repeat",
   backgroundSize:"cover",
   backgroundPosition:"center center",
   width:150,
   height:150,
   margin:"0 auto",
   boxShadow:"none"
  },
  phlogo:{
  width: 192,
  display: "block",
  margin: "0 auto",
  padding: 50
 }
}


class Stories360About extends React.Component {
  render () {

    return (
      <div>
      <Container>
       <Row>
        <Col>

         <h2 className="menu-sites-title menu-sites-text"> {translate("header").about} </h2>
         <p className="menu-sites-text">
          {translate("about").intro}
          <a href="http://www.kibs.ch/Fellows" target="_new_tab">
           <FontIcon className="material-icons" style={{verticalAlign:"middle"}}>link</FontIcon>
          </a>
         </p>

         </Col>
       </Row>
      </Container>

      <Container>
       <Row>

         <Col lg={6} md={6} sm={12} xs={12}>
          <Paper zDepth={0} style={styles.paperPerson}>
           <Paper zDepth={2} circle={true} style={
            Object.assign(
              {},
              styles.person,
              {backgroundImage:"url(/client/images/christoph.png)"}
            )
           }/>

           <h3> {translate("about").christoph} </h3>
           <p className="menu-sites-text"> {translate("about").christopFunction} </p>
          </Paper>
         </Col>

         <Col lg={6} md={6} sm={12} xs={12}>
          <Paper zDepth={0} style={styles.paperPerson}>
           <Paper zDepth={2} circle={true} style={
            Object.assign(
              {},
              styles.person,
              {backgroundImage:"url(/client/images/nico.png)"}
            )
           }/>

           <h3> {translate("about").nico} </h3>
           <p className="menu-sites-text"> {translate("about").nicoFunction} </p>
          </Paper>
         </Col>

         <a href="https://www.phbern.ch/" target="_new_tab">
          <img src="client/images/phbern_logo.png" style={styles.phlogo} />
         </a>

       </Row>
      </Container>

      <Container>
       <Row>
        <Col>

         <p className="menu-sites-subheader menu-sites-text"> {translate("about").why}</p>
         <p className="menu-sites-text"> {translate("about").whyContent} </p>

        </Col>
       </Row>
      </Container>


     </div>
    )
  }
}



export default Stories360About
