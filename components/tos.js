import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {deepPurple500,orange500} from 'material-ui/styles/colors'
import {translate} from '../client/lang/translation'



class Stories360Tos extends React.Component {
  render () {
    return (
      <Container>
       <Row>
        <Col>

         <h2 className="menu-sites-title menu-sites-text"> {translate("header").tos} </h2>

         <p className="menu-sites-subheader menu-sites-text"> {translate("tos").copyright} </p>
         <p className="menu-sites-text"> {translate("tos").copyrightContent} </p>

         <p className="menu-sites-subheader menu-sites-text"> {translate("tos").supervision} </p>
         <p className="menu-sites-text"> {translate("tos").supervisionContent} </p>

         <p className="menu-sites-subheader menu-sites-text"> {translate("tos").availibility} </p>
         <p className="menu-sites-text"> {translate("tos").availibilityContent} </p>

        </Col>
       </Row>
      </Container>
    )
  }
}


export default Stories360Tos
