import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {translate} from '../client/lang/translation'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Paper from 'material-ui/Paper'
import FontIcon from 'material-ui/FontIcon'
import YouTube from 'react-youtube'

const styles = {
  alternative:{
   padding:20,
   position:"relative",
   height:400,
   marginBottom:20,
   backgroundRepeat:"no-repeat",
   backgroundPosition:"center center",
   backgroundSize:"cover"
 },
 alternativeText:{
  position:"absolute",
  bottom:0,
  left:0,
  width:"100%",
  color:'#fff',
  padding:20,
  margin:0,
  background:"rgba(0,0,0,.5)"
 }
}


class Stories360Tips extends React.Component {
  render () {
    const opts = {
      height: 500,
      width: '100%',
      playerVars: {
       controls: 0,
       disablekb: 1,
       fs: 0,
       rel: 0,
       iv_load_policy: 3
     }
    }

    return (
     <Container>
      <Row>
       <Col>

        <h2 className="menu-sites-title menu-sites-text"> {translate("header").tips} </h2>
        <BestPracticeItem text={translate("about").bestPractices1} />
        <BestPracticeItem text={translate("about").bestPractices2} />
        <BestPracticeItem text={translate("about").bestPractices3} />
        <BestPracticeItem text={translate("about").bestPractices4} />
        <BestPracticeItem text={translate("about").bestPractices5} />
        <BestPracticeItem text={translate("about").bestPractices6} />
        <BestPracticeItem text={translate("about").bestPractices7} />
        <BestPracticeItem text={translate("about").bestPractices8} />
        <BestPracticeItem text={translate("about").bestPractices9} video="rbzRZunZclg" opts={opts} />
        <BestPracticeItem text={translate("about").bestPractices10} video="qWgg1StZ2Kw" opts={opts}/>
        <BestPracticeItem text={translate("about").bestPractices11} />
        <BestPracticeItem text={translate("about").bestPractices12} />

       </Col>
      </Row>

      <Row>
       <Col>
        <p className="menu-sites-subheader menu-sites-text"> {translate("about").streetview}</p>
        <BestPracticeItem text={translate("about").streetviewContent} video="cLItJdfGtO8" opts={opts} />
        <BestPracticeItem text={translate("about").streetviewContent1} />
        <BestPracticeItem text={translate("about").streetviewContent2} />
       </Col>
      </Row>

      <Row>
       <Col>
        <p className="menu-sites-subheader menu-sites-text"> {translate("about").alternatives}</p>

        <Alternative link="https://cospaces.io/" text={translate("about").cospaces} image={"client/images/cospaces.PNG"} />
        <Alternative link="https://www.thinglink.com/" text={translate("about").thinglink} image={"client/images/thingiling.PNG"} />
        <Alternative link="https://vizor.io/" text={translate("about").vizor} image={"client/images/vizor.PNG"} />
        <Alternative link="https://www.storyspheres.com/" text={translate("about").storyspheres} image={"client/images/storyspheres.PNG"} />
        <Alternative link="https://edu.google.com/expeditions/" text={translate("about").expeditions} image={"client/images/expeditions.PNG"} />
        <Alternative link="http://www.view-master.com/de-de" text="" image={"client/images/viewmaster.PNG"} />

       </Col>
      </Row>

     </Container>
   )
  }
}

class BestPracticeItem extends React.Component {
  render () {
    const text = this.props.text
    const video = this.props.video
    const opts = this.props.opts

    return (
     <p className="menu-sites-text">
      <FontIcon className="material-icons">info_outline</FontIcon> {text}
      <p> {video && <YouTube videoId={video} opts={opts} />} </p>
     </p>
    )
  }
}

class Alternative extends React.Component {
  render () {
    const image = this.props.image
    const link = this.props.link
    const text = this.props.text

    return (
      <Col lg={4} md={6} sm={12} xs={12}>
      <a href={link} target="_new_tab">
       <Paper zDepth={1} style={
        Object.assign(
          {},
          styles.alternative,
          {backgroundImage:"url("+image+")"}
        )
       }>
        <p className="menu-sites-text" style={styles.alternativeText}> {text} </p>
       </Paper>
      </a>
      </Col>
    )
  }
}


export default Stories360Tips
