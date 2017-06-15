import React from 'react'
import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'
import {observer} from 'mobx-react'
import DashboardStore from '../../stores/dashboardstore'
import {lightBlue400,amber600} from 'material-ui/styles/colors'
import {Container,Row,Col} from 'react-grid-system'
import {List, ListItem} from 'material-ui/List'
import Toggle from 'material-ui/Toggle'
import {translate} from '../../client/lang/translation'


const styles = {
  section:{
    position:"absolute",
    backgroundColor:lightBlue400,
    width:"100%",
    minHeight:"100%"
  },
  iframe:{
    width:"100%",
    height:500,
    border:"none"
  },
  paper:{
    marginTop:20,
    marginBottom:20,
    padding:10
  },
  title:{
    fontSize:40,
    color:"rgba(0, 0, 0, 0.870588)",
    verticalAlign:"middle"
  },
  logo:{
    height:55,
    verticalAlign:"middle",
    marginRight:10
  }
}

@observer
class Dashboard extends React.Component {
  render () {
    const store = DashboardStore
    return (
      <section style={styles.section}>
       <Container>
        <Row>
         <Col>

          <Paper style={styles.paper}>
           <div style={{textAlign:"center"}}>
            <img src="client/images/logo.png" style={styles.logo} />
            <span style={styles.title} className="stories360"> {translate("header").title}-{translate("dashboard").title}</span>
           </div>
          </Paper>

          <Paper style={styles.paper}>
           <TextField
            hintText={translate("dashboard").input}
            onChange={this.loadScene}
            fullWidth={true}
           />
          </Paper>

          {store.hasScene && <SceneToEdit store={store} />}

         </Col>
        </Row>
       </Container>
      </section>
    )
  }

  loadScene (e,value) {
    DashboardStore.loadScene(value)
  }
}


@observer
class SceneToEdit extends React.Component {
  render () {
    const store = this.props.store
    return (
      <div>
        <Paper style={styles.paper}>
         <iframe style={styles.iframe} src={store.url}></iframe>
        </Paper>
        <SceneConfig store={store} />
      </div>
    )
  }
}


@observer
class SceneConfig extends React.Component {
  render () {
    const store = this.props.store

    return (
      <Paper style={styles.paper}>
       <List>

        <ListItem
         primaryText={!!+store.scene.public ? translate("dashboard").published : translate("dashboard").dePublish}
         rightToggle={
          <Toggle
           defaultToggled={!!+store.scene.public}
           onToggle={this.publishScene}
          />
         }
        />

        <ListItem
         primaryText={!!+store.scene.deleted ? translate("dashboard").deleted : translate("dashboard").undeleted}
         rightToggle={
          <Toggle
           defaultToggled={!!+store.scene.deleted}
           onToggle={this.deleteScene}
          />
         }
        />

       </List>
      </Paper>
    )
  }

  publishScene (e,value) {
   DashboardStore.updatePublic(value)
  }

  deleteScene (e, value) {
   DashboardStore.updateDelete(value)
  }


}







export default Dashboard
