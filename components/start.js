import React from 'react'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {Link} from 'react-router'
import stores from '../stores/vrestores'
import catalog from '../stores/catalogstore'
import {observer} from 'mobx-react'
import {Container,Row,Col} from 'react-grid-system'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import FontIcon from 'material-ui/FontIcon'
import {translate} from '../client/lang/translation'
import Paper from 'material-ui/Paper'
import {orange500,yellow500,deepPurple500,deepOrange500,amber600,lightBlue400} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar'
import CircularProgress from 'material-ui/CircularProgress'

const styles ={
  banner:{
    height:500,
    background:"#fff"
  },
  bannerWrapper:{
   textAlign:"center"
  },
  headImage:{
    height:270,
    paddingTop:35
  },
  headline:{
   color:"rgba(255, 255, 255, 0.870588)",
   fontWeight:300,
   fontSize: 56
  },
  explainerSection:{
   background:lightBlue400,
   color:'#fff',
   textAlign:"center",
   paddingTop:30,
   paddingBottom:30
  },
  explainImage:{
    height:120
  },
  searchBarContainer:{
   marginBottom:30,
   height:50
  },
  searchBar:{
    width:"85%",
  },
  searchIcon:{
    verticalAlign:"top"
  },
  sceneCard:{
    height:200,
    backgroundRepeat:"no-repeat",
    backgroundPosition:"center center",
    backgroundSize:"cover",
    position:"relative",
    marginBottom:30,
    cursor:"pointer"
  },
  textWrapper:{
    position:"absolute",
    bottom:0,
    backgroundColor:"rgba(0,0,0,.5)",
    width:"100%",
    color:'#fff',
    height:50
  },
  title:{
   paddingLeft:10,
   paddingRight:10,
   paddingTop:10
  },
  subtitle:{
   paddingLeft:12,
   paddingRight:12,
   fontSize:10
  },
  cardboardIcon:{
   position:"absolute",
   right:10,
   bottom:60
  },
  cardboardSvg:{
   width:"45px",
   height:"45px"
 },
 siteLoader:{
   position:"absolute",
   left:0,
   right:0,
   margin:"0 auto",
   top:100
 },
 loadMoreBtn:{
   width:"100%"
 },
 catalog:{
   paddingBottom:100
 },
 isSearchingLoader:{
  display:"block",
  margin:"0 auto"
 },
 createSceneBtn:{
  position: "absolute",
  bottom: -60,
  width: 300,
  height:50,
  left: 0,
  right: 0,
  margin: "0 auto"
 },
 blockquote:{
   position:"relative",
   width:330,
   margin:"0 auto",
   clear:"right"
 },
 authorImage:{
   backgroundRepeat:"no-repeat",
   backgroundPosition:"center center",
   backgroundSize:"cover",
   backgroundImage:"url(client/images/picasso.jpg)",
   position:"relative",
   width:70,
   height:70,
   margin:"0 auto"
 },
 description:{
   paddingTop:15,
   fontStyle:"italic"
 }
}

@observer
class Start extends React.Component {

 render () {
  const store = stores.app
  return (
   <div>
    {!this.state.componentDidMount &&
      <CircularProgress size={80} thickness={5} style={styles.siteLoader} />
    }
    {this.state.componentDidMount &&
      <div>
       <Banner store={store} />
       <Explainer />
       <Catalog store={store}/>
      </div>
    }
   </div>
  )
 }

 constructor (props) {
   super(props)
   this.state = {componentDidMount:false}
 }

 componentDidMount () {
   this.setState({componentDidMount:true})
 }

}

@observer
class Banner extends React.Component {
  render () {
    const store = this.props.store
    return (
      <section style={styles.banner}>
       <Container>
        <Row>
         <Col style={styles.bannerWrapper}>
          <img src="client/images/vr_fantasy_500_compressed.png" style={styles.headImage}/>
          <blockquote style={styles.blockquote}>
           <p style={styles.description}> {translate("index").description} </p>
           <Paper circle={true} zDepth={2} style={styles.authorImage}></Paper>
          </blockquote>

            <Link to={"vreditor?vr="+store.uid}>
             <RaisedButton
              label={translate("index").createScene}
              style={styles.createSceneBtn}
              labelStyle={{fontSize:'1.5em'}}
              buttonStyle={{height:50}}
              primary={true}
            />
            </Link>

         </Col>
        </Row>
       </Container>
      </section>
    )
  }
}

@observer
class Explainer extends React.Component {
  render () {
    return (
      <section style={styles.explainerSection}>
       <Container>
        <Row>
         <Col lg={4} md={4} sm={12} xs={12}>
          <img src="client/images/vrscene.png" style={styles.explainImage} />
          <h2> {translate("index").vr} </h2>
          <p> {translate("index").vrContent} </p>
         </Col>
         <Col lg={4} md={4} sm={12} xs={12}>
          <img src="client/images/story.png" style={styles.explainImage} />
          <h2> {translate("index").storytelling} </h2>
          <p> {translate("index").storytellingContent} </p>
         </Col>
         <Col lg={4} md={4} sm={12} xs={12}>
          <img src="client/images/buildandwatch.png" style={styles.explainImage} />
          <h2> {translate("index").coop} </h2>
          <p> {translate("index").coopContent} </p>
         </Col>
        </Row>
       </Container>
      </section>
    )
  }
}

@observer
class Catalog extends React.Component {
  render () {
    return (
      <section style={styles.catalog}>
       <SearchBar />
       <Container>
        <Row>
         {catalog.results.map( (scene,index) => {
           return <Col key={index} lg={4} md={4} sm={12} xs={12}>
                   <Scene scene={scene} />
                  </Col>
          })
         }

         <Col lg={12} md={12} sm={12} xs={12}>
          {catalog.isSearching &&
           <CircularProgress size={40} thickness={5} style={styles.isSearchingLoader} />
          }
          {!catalog.isSearching && catalog.thereIsMoreToLoad &&
            <FlatButton
             label={translate("index").loadMore}
             onTouchTap={catalog.search}
             style={styles.loadMoreBtn}
            />
          }
         </Col>

        </Row>
       </Container>
      </section>
    )
  }
}

@observer
class SearchBar extends React.Component {
  constructor (props) {
    super(props)
    this.onSearchKey = this.onSearchKey.bind(this)
    this.setKeyword = this.setKeyword.bind(this)
  }

  render () {
    return (
      <Container>
        <Paper style={styles.searchBarContainer} zDepth={3}>
          <IconButton style={styles.searchIcon} onTouchTap={catalog.search}>
           <FontIcon className="material-icons">search</FontIcon>
          </IconButton>
          <TextField
           className="ellipsis"
           key="scene-search-bar"
           hintText={translate("index").search}
           onChange={this.setKeyword}
           onKeyPress={this.onSearchKey}
           style={styles.searchBar}
          />
        </Paper>
      </Container>
    )
  }

  setKeyword (e,value) {
    catalog.setCurrentSearchWord(value)
  }

  onSearchKey (e) {
    if (e.keyCode === 13 || e.which === 13) {
      catalog.search()
    }
  }

  componentDidMount () {
    catalog.search()
  }
}

@observer
class Scene extends React.Component {
  constructor (props) {
    super(props)
    this.state = {zDepth:1}
  }

  render () {
    const scene = this.props.scene
    const bg = scene.image && scene.image !== '' ? scene.thumbnail : ''

    return (
      <a href={scene.link}>
        <Paper
         zDepth={this.state.zDepth}
         onMouseEnter={() => {this.setState({zDepth:3})}}
         onMouseLeave={() => {this.setState({zDepth:1})}}
         style={
           Object.assign(
             {},
             styles.sceneCard,
             {backgroundImage:"url("+bg+")"}
           )
         }
        >
        <div>

          <Avatar
           icon={<img src="client/images/cardboard.svg" style={styles.cardboardSvg}/>}
           backgroundColor={amber600}
           size={40}
           style={styles.cardboardIcon}
         />

           <div style={styles.textWrapper}>
            <div style={styles.title} className="ellipsis"> {scene.title} </div>
            <div style={styles.subtitle} className="ellipsis"> {scene.subtitle} </div>
           </div>

         </div>
        </Paper>
      </a>
    )
  }
}


export default Start
