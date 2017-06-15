import React from 'react'
import {Container,Row,Col} from 'react-grid-system'
import {deepPurple500,orange500,lightBlue400} from 'material-ui/styles/colors'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FontIcon from 'material-ui/FontIcon'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {translate} from '../client/lang/translation'
import stores from '../stores/vrestores'
import ObjectUpload from './objectupload'
import {observer} from 'mobx-react'
import CircleObject from './circleobject'
import CircleObject2 from './circleobject2'
import CircleObjectMenu from './circleobjectmenu'
import ReactPlayer from 'react-player'
import RaisedButton from 'material-ui/RaisedButton'


const styles = {
 headSection:{
   backgroundColor:"rgba(0,0,0,.01)",
 },
 addObjectButton:{
  position:"absolute",
  top:"47%",
  width:"10%",
  margin:"0 auto",
  left:0,
  right:0,
  textAlign:"center"
 },
 you:{
   border:"none",
   boxShadow:"none"
 },
 introWrapper:{
   position:"absolute",
   width:"100%",
   marginTop:110,
   paddingTop:10,
   paddingBottom:20,
   textAlign:"center",
   background:lightBlue400,
   color:'#fff'
 }
}

@observer
class Intro extends React.Component {
  render () {
    const ui = this.props.ui

    let className = ui.showIntro ? "" : "fadeOut"
    let zIndex = ui.showIntro ? 1 : -1

    return (
      <div style={
        Object.assign(
          {},
          styles.introWrapper,
          {zIndex:zIndex}
        )
       }
       className={"animated " + className}
      >
       <Container>
        <Row>
         <Col>

          <div>
           <p> {translate("vreditor").imagine} </p>
           <RaisedButton
            label={translate("vreditor").acknowledge}
            onTouchTap={ui.hideIntro}
            primary={true}
           />
          </div>

         </Col>
        </Row>
       </Container>
      </div>
    )
  }
}

@observer
class Circles extends React.Component {

 render () {
  const store = stores.app
  const ui = stores.ui.circle
  const showIntro = ui.showIntro && stores.app.objects && stores.app.objects.length === 0

  return (
   <section style={styles.headSection}>
    {showIntro && <Intro ui={ui} />}
    <Container>
     <Row>
      <Col lg={1} md={1} sm={0} xs={0} />
      <Col lg={10} md={10} sm={12} xs={12}>
       <div className="vr2dcontainer" ref='circlecontainer'>

         <Circle distance={8} objects={store.getObjects(3)} />
         <Circle distance={6} objects={store.getObjects(2)} />
         <Circle distance={4} objects={store.getObjects(1)} />

         <img src="client/images/you2.png" className="inner-vr2dcircle" style={styles.you} />
         <ObjectUpload style={styles.addObjectButton}/>

         <CircleObjectMenu />

         <ReactPlayer
          url={ui.soundFile}
          playing={ui.playing}
          volume={0.8}
          hidden={true}
          key="circleobject-player"
         />

       </div>
      </Col>
      <Col lg={1} md={1} sm={0} xs={0} />
     </Row>
    </Container>

   </section>
  )
 }

 componentDidMount () {
  // const circle = stores.ui.circle
  // circle.setCircle(this.refs.circlecontainer)
  // window.addEventListener('resize',circle.setCenter)
 }

 componentDidUpdate () {
  //  const circle = stores.ui.circle
  //  circle.setCenter()
 }

}

@observer
class Circle extends React.Component {

 render () {
  const style = {
    WebkitBoxShadow : "inset 10px 10px 5px 5px rgba(0,0,0,.5)",
    BoxShadow: "inset 10px 10px 5px 5px rgba(0,0,0,.5)"
  }

  return (
    <div
     className={"vr2dcircle inner-vr2dcircle circle-distance-"+this.props.distance+"m"}
     id={"distance-"+this.props.distance+"m"}
    >
     {this.props.objects.map((item,index) => {
      return <CircleObject key={item.id} item={item} distance={this.props.distance}/>
      })
     }
    </div>
  )
 }

}






export default Circles
