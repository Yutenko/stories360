import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {translate} from '../client/lang/translation'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon'
import YouTube from 'react-youtube'
import {amber600} from 'material-ui/styles/colors'

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

         <h2 className="menu-sites-title menu-sites-text"> {translate("header").lesson} </h2>
         <FontIcon
          className="material-icons"
          style={{transform: "rotate(320deg)",fontSize:"1000%",position:"absolute",top:"20%",left:"35%",color:amber600,cursor:"pointer"}}
         >touch_app</FontIcon>
         <a href="https://docs.google.com/document/d/1uNOlgUqUefDMruTRoYDhGahl8cp9YkGb1HqH62xXaEI/edit" target="_new_tab">
          <img src="client/images/lesson.png" style={{width:"100%"}} />
         </a>

         </Col>
       </Row>
      </Container>


     </div>
    )
  }
}



export default Stories360About
