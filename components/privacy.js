import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {deepPurple500,orange500} from 'material-ui/styles/colors'
import {translate} from '../client/lang/translation'


class Stories360Privacy extends React.Component {
  render () {
    return (
      <Container>
       <Row>
        <Col>

         <h2 className="menu-sites-title menu-sites-text"> {translate("header").privacy} </h2>

         <p className="menu-sites-subheader menu-sites-text"> {translate("privacy").logfiles} </p>
         <p className="menu-sites-text"> {translate("privacy").logfilesContent} </p>

         <p className="menu-sites-subheader menu-sites-text"> {translate("privacy").thiryparty} </p>
         <p className="menu-sites-text"> {translate("privacy").thirdpartyContent} </p>

         <p className="menu-sites-subheader menu-sites-text"> {translate("privacy").cookies} </p>
         <p className="menu-sites-text"> {translate("privacy").cookiesContent} </p>

        </Col>
       </Row>
      </Container>
    )
  }
}


export default Stories360Privacy
