import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {grey700} from 'material-ui/styles/colors'
import {translate} from '../client/lang/translation'

const styles ={
  text:{
    paddingTop:18
  }
}

class Footer extends React.Component {
  render () {
    return (
      <footer className="footer">
       <Container>
        <Row>
         <Col>
          <div style={styles.text}> © 2017 {translate("header").title} </div>
         </Col>
        </Row>
       </Container>
      </footer>
    )
  }
}


export default Footer
