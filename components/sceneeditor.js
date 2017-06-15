import React from 'react'
import {observer} from 'mobx-react'
import stores from '../stores/vrestores'
import {Card, CardHeader, CardText, CardMedia, CardTitle, CardActions} from 'material-ui/Card'
import {List,ListItem} from 'material-ui/'
import {Container,Row,Col} from 'react-grid-system'
import {translate} from '../client/lang/translation'
import Avatar from 'material-ui/Avatar'
import FontIcon from 'material-ui/FontIcon'
import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import Waypoint from 'react-waypoint'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'
import Badge from 'material-ui/Badge'
import { Droppable, Draggable } from 'react-drag-and-drop'

const styles = {
  sceneCard:{
    height:250,
    backgroundRepeat:"no-repeat",
    backgroundPosition:"center center",
    backgroundSize:"cover",
    position:"relative",
    marginBottom:30
  },
  indicator:{
   position:"absolute",
   left:10,
   top:10,
   fontSize: "400%",
   cursor:"pointer",
   zIndex:1
  },
  sceneTitle:{
   background: "rgba(0, 0, 0, 0.541176)",
   position:"absolute",
   color:'#fff',
   bottom:0,
   width:"100%",
   fontSize:20,
   paddingTop:10,
   paddingBottom:10,
   textAlign:"center"
  }
}

@observer
class SceneEditor extends React.Component {

 render () {
   const scenes = stores.app.scenes
   return (
     <Container>
      <Row>
       <Col md={12}>
        <Card style={{marginBottom:30}}>
         <CardHeader
          title={translate("sceneeditor").title}
          subtitle={translate("sceneeditor").subtitle}
          avatar={<Avatar icon={<FontIcon className="material-icons">public</FontIcon>}/>}
         />
         <CardText>
          <SceneList scenes={scenes} />
        </CardText>
       </Card>
      </Col>
     </Row>
    </Container>
   )
 }
}

@observer
class SceneList extends React.Component {
  render () {
    const scenes = this.props.scenes

    return (
      <Container>
       <Row>
         <Droppable
          types={['sc']}
          onDrop={this.onDrop.bind(this)}
         >
          <div>
          {
            scenes.map((scene, index) => {
             return <Col key={index} sm={6} md={6} lg={4}>
                     <Scene scene={scene}/>
                    </Col>
            })
          }

          <Col sm={6} md={6} lg={4}>
           <AddingSceneDialog />
          </Col>

         </div>
       </Droppable>
      </Row>
     </Container>
    )
  }

  onDrop (change) {
    const withMe = stores.ui.sceneeditor.getCurrentDragenterId()
    stores.app.swapScene(change.sc,withMe)
  }

}


@observer
class Scene extends React.Component {
  render () {
    const scene = this.props.scene
    const store = stores.app
    const mySelf = stores.app.share_uid_public === scene.share_uid_public

    return (
      <Draggable
       type="sc"
       data={scene.share_uid_public}
      >
       <Paper zDepth={1} onDragEnter={this.onDragEnter.bind(this)} style={
         Object.assign(
           {},
           styles.sceneCard,
           {backgroundImage:'url("'+scene.image+(mySelf?'?v='+Math.random():'')+'")',cursor:!mySelf ? 'move' :  'auto'}
         )
        }>
        <div style={styles.sceneTitle}>
         {scene.title}
        </div>
        {!mySelf &&
          <FontIcon
           className="material-icons"
           style={Object.assign({},styles.indicator,{color: "#ffffff"})}
           onTouchTap={this.delete.bind(this)}
          >delete_forever</FontIcon>
        }
       </Paper>
     </Draggable>
    )
  }

  onDragEnter () {
    stores.ui.sceneeditor.setCurrentDragenterId(this.props.scene.share_uid_public)
  }

  delete (e) {
    e.stopPropagation()
    stores.app.deleteSceneServer(this.props.scene)
  }

}

@observer
class AddingSceneDialog extends React.Component {
  render () {
    const ui = stores.ui.sceneeditor
    return (
      <Paper zDepth={1} style={styles.sceneCard}>
      <FloatingActionButton style={{position:"absolute",top:"40%",left:"40%"}}>
        <Dialog
         title={translate("sceneeditor").title}
         modal={false}
         open={ui.open}
         onRequestClose={ui.handleClose}
         autoScrollBodyContent={true}
         contentStyle={{position: 'absolute',left: '50%',transform: 'translate(-50%, -50%)',width:"100%"}}
        >
         <SceneDialog />
        </Dialog>

       <FontIcon
        className="material-icons"
        onTouchTap={ui.handleOpen}
       >add</FontIcon>
      </FloatingActionButton>
     </Paper>
    )
  }
}

@observer
class SceneDialog extends React.Component {
  render () {
    const store = stores.ui.sceneeditor
    return (
      <div>
        <TextField
         key="scene-dialog-search"
         hintText={translate("sceneeditor").searchbar}
         onChange={this.search.bind(this)}
         fullWidth={true}
         onKeyPress={this.showResults.bind(this)}
        />
        <List>
          {store.results.map((scene,index) => {
            return <ScenePreview
                    scene={scene}
                    key={index}
                    hasWaypoint={store.fireNextSearchAtItem==index}
                    index={index}
                   />
           })
         }
         </List>
      </div>
    )
  }

  componentDidMount () {
    stores.ui.sceneeditor.reset()
  }

  search (e,value) {
   const ui = stores.ui.sceneeditor
   ui.setCurrentKeyword(value)
  }

  showResults (e) {
   const ui = stores.ui.sceneeditor
   if (e.keyCode === 13 || e.which === 13) {
    const resetSearch = true
    ui.search(resetSearch)
   }
  }

}

@observer
class ScenePreview extends React.Component {
  render () {
   const ui = stores.ui.sceneeditor
   const store = stores.app
   const scene = this.props.scene
   const iamSelected = store.currentSelectedIndex == this.props.index
   const style = {background:iamSelected?"rgba(0,0,0,.2)":"none"}

   return (
    <ListItem
     onTouchTap={this.select.bind(this,scene)}
     leftAvatar={<Avatar src={scene.thumbnail} />}
     primaryText={scene.title}
     secondaryText={<p> {scene.subtitle} </p>}
     secondaryTextLines={2}
     innerDivStyle={style}
     rightIconButton={
       <FloatingActionButton mini={true} onClick={store.addSceneServer.bind(this,scene)}>
        <FontIcon className="material-icons">add</FontIcon>
       </FloatingActionButton>
     }
    >
     {this.props.hasWaypoint && <Waypoint onEnter={this.onEnter.bind(this,ui)}/>}
    </ListItem>
   )
  }

  select (scene) {
    const ui = stores.ui.sceneeditor
    ui.setCurrentSelectedIndex(this.props.index)
    alert("view scene from here in new tab?")
  }

  onEnter (ui) {
    const resetSearch = false
    ui.search(resetSearch)
  }

}



export default SceneEditor
