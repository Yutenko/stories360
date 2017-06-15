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
import Draggable from "gsap/Draggable"
import {TweenMax} from 'gsap'
import {lightBlue400} from 'material-ui/styles/colors'
import {Tabs, Tab} from 'material-ui/Tabs'


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
   background: lightBlue400,
   position:"absolute",
   color:'#fff',
   bottom:0,
   width:"100%",
   fontSize:20,
   paddingTop:10,
   paddingBottom:10,
   textAlign:"center"
  },
  badge:{
   position:"absolute",
   width:50,
   height:50,
   right:-15,
   top:-15,
   textAlign:"center",
   cursor:"pointer"
  },
  badgeText:{
   fontSize:"200%",
   paddingTop:8,
   color:"rgba(0, 0, 0, 0.42)"
 },
 addMoreScenesBtn:{
   position:"absolute",
   right:0,
   bottom:-40
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
          avatar={
           <Avatar
            backgroundColor={lightBlue400}
            icon={
              <FontIcon className="material-icons">public</FontIcon>
            }/>
          }
         />
         <CardText id="parentRef">
          <SceneList scenes={scenes}/>
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
    const ui = stores.ui.sceneeditor

    return (
      <Container>
       <Row>
          <div>
          {
            scenes.map((scene, index) => {
             return <Col key={index} lg={12} md={12} sm={12} xs={12}>
                     <Scene scene={scene} index={index+1} max={scenes.length}/>
                    </Col>
            })
          }

          <Col lg={12} md={12} sm={12} xs={12}>
           <AddingSceneDialog />
          </Col>

         </div>
      </Row>
     </Container>
    )
  }
}


@observer
class Scene extends React.Component {
  render () {
    const scene = this.props.scene
    const store = stores.app
    const mySelf = stores.app.share_uid_public === scene.share_uid_public
    const numberScenes = this.props.max

    return (
       <Paper zDepth={1} style={
         Object.assign(
           {},
           styles.sceneCard,
           {backgroundImage:'url("'+scene.image+(mySelf?'?v='+Math.random():'')+'")',cursor:!mySelf ? 'move' :  'auto'}
         )
        }
        id={"scene-"+scene.share_uid_public}
        key={"scene-"+scene.share_uid_public}
       >
       {numberScenes > 1 &&
         <Paper circle={true} style={styles.badge}>
          <div style={styles.badgeText}> {this.props.index} </div>
         </Paper>
       }
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
    )
  }

  componentDidMount () {
    this.makeDraggable()
  }

  componentDidUpdate () {
    this.makeDraggable()
  }

  makeDraggable () {
    const mySelf = stores.app.share_uid_public === this.props.scene.share_uid_public

    if (!mySelf) {
      const id = "#scene-"+this.props.scene.share_uid_public
      const share_uid_public = this.props.scene.share_uid_public
      const scene = this.props.scene

      Draggable.create(id, {
        lockAxis:true,
        type:'y',
        bounds:"#parentRef",
        onDragEnd: function () {
         var self = this
         stores.app.scenes.map( s => {
          if (self.hitTest("#scene-"+s.share_uid_public,"40%") && scene.share_uid_public !== s.share_uid_public) {
           stores.app.swapScene(scene.share_uid_public,s.share_uid_public)
          } else {
            TweenLite.set(id, {clearProps:"x"})
          }
         })
        }
      })
    }
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

      <FloatingActionButton style={styles.addMoreScenesBtn}>
        <Dialog
         title={translate("sceneeditor").title}
         modal={false}
         open={ui.open}
         onRequestClose={ui.handleClose}
         autoScrollBodyContent={true}
         style={{minHeight:300}}
         contentStyle={{position: 'absolute',left: '50%',transform: 'translate(-50%, -50%)',width:"100%"}}
        >
         <SceneDialog />
        </Dialog>

       <FontIcon
        className="material-icons"
        onTouchTap={ui.handleOpen}
       >add</FontIcon>
      </FloatingActionButton>

    )
  }
}

@observer
class SceneDialog extends React.Component {
  render () {
    return (
      <Tabs>
       <Tab label={translate("sceneeditor").catalogue}>
        <SearchCatalog />
       </Tab>
       <Tab label={translate("sceneeditor").byURL}>
        <SearchByURL />
       </Tab>
      </Tabs>
    )
  }

}

@observer
class SearchByURL extends React.Component {
  render () {
    const store = stores.ui.sceneeditor

    return (
        <TextField
         key="scene-dialog-search-by-url"
         hintText={translate("sceneeditor").searchByURL}
         onChange={this.onChange}
         fullWidth={true}
         onKeyPress={this.onKeyPress}
        />
    )
  }

  onChange (e,value) {
    const store = stores.ui.sceneeditor
    store.searchByURL(value)
  }

  onKeyPress (e,value) {
    if (e.keyCode === 13 || e.which === 13) {
      const store = stores.ui.sceneeditor
      store.searchByURL(value)
    }
  }
}

@observer
class SearchCatalog extends React.Component {
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
  }

  onEnter (ui) {
    const resetSearch = false
    ui.search(resetSearch)
  }

}



export default SceneEditor
