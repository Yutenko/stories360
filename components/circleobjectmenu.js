import React from 'react'
import Paper from 'material-ui/Paper'
import Slider from 'material-ui/Slider'
import stores from '../stores/vrestores'
import {observer} from 'mobx-react'
import {translate} from '../client/lang/translation'
import {secondsToHms} from '../client/js/helper'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import Popover from 'material-ui/Popover'
import TextField from 'material-ui/TextField'
import Toggle from 'material-ui/Toggle'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'

var styles = {
  paper:{
    padding:15,
    overflow:"hidden"
  },
  sliderContainer:{
    position:"relative"
  },
  slider:{
    minWidth:200,
    width:"70%"
  },
  sliderCount:{
    float:"right"
  },
  deleteButton:{
    marginTop:20
  },
  typeWrapper:{
   textAlign:"center"
  },
  nearArrow:{
    float:"left"
  },
  farArrow:{
    float:"right"
  },
  typeSymbol:{
    maxHeight:70,
  },
  keepDistance:{

  },
  sliderStyle:{
    margin:0
  },
  textItemSpacer:{
    marginTop:20,
    marginBottom:20
  }
}

@observer
class CircleObjectMenu extends React.Component {
  render () {
   const ui = stores.ui.circleobject
   const item = stores.ui.circleobject.currentItem

   return (
     <Popover
      open={ui.open}
      anchorEl={ui.anchorElement}
      onRequestClose={ui.handleClose}
      anchorOrigin={{"horizontal":"middle","vertical":"center"}}
      targetOrigin={{"horizontal":"middle","vertical":"center"}}
     >
       <Paper zDepth={1} style={styles.paper}>
        {item &&
         <div style={styles.typeWrapper}>
          <img src={ui.typeSmbol} style={styles.typeSymbol} />
         </div>
        }
        <div style={styles.keepDistance}>
          {item && item.type !== 'text' && <TextToSpeechElement item={item} />}
          {item && item.type === 'text' &&
           <div style={styles.textItemSpacer}>
            <EditText item={item} />
           </div>
          }

          <DistanceSlider item={item} />
          <CircleObjectSlider type="scale" item={item} />
          <CircleObjectSlider type="raise" item={item} />

          {item && item.type === 'audio' && <VolumeSlider item={item} />}
          {item && item.type === 'video' && <YoutubeStartTimeSlider item={item} />}

          <FlatButton
           label={translate("global").delete}
           primary={true}
           fullWidth={true}
           style={styles.deleteButton}
           onTouchTap={this.removeItem.bind(this)}
           icon={<FontIcon className="material-icons">delete_forever</FontIcon>}
          />
        </div>
       </Paper>
     </Popover>
   )
 }

 removeItem () {
   stores.app.deleteObject(stores.ui.circleobject.currentItem)
   stores.ui.circleobject.handleClose()
 }
}

@observer
class EditText extends React.Component {
  render () {
    const item = this.props.item
    const store = stores.app

    return (
      <TextField
       multiLine={true}
       fullWidth={true}
       rows={1}
       rowsMax={4}
       name={"edit-text-"+item.id}
       onChange={this.onChange.bind(this)}
       onBlur={this.onBlur.bind(this)}
       value={item.src}
      />
    )
  }

  onChange (e,value) {
   this.props.item.setSrc(value)
  }

  onBlur (e) {
    this.props.item.updateObjectServer()
  }

}

@observer
class YoutubeStartTimeSlider extends React.Component {
  render () {
    const item = this.props.item

    return (
      <div style={styles.sliderContainer}>
       <span>{translate("vreditor").ytStartTime}</span>
       <span style={styles.sliderCount}> {secondsToHms(item.youtubestarttime)} </span>
       <Slider
         min={0}
         max={item.youtubemaxduration}
         step={1}
         value={item.youtubestarttime}
         className="circleobject-slider"
         onDragStop={item.updateObjectServer}
         onChange={this.onChange}
         style={styles.slider}
         sliderStyle={styles.sliderStyle}
       />
      </div>
    )
  }

  onChange = (e,value) => {
    this.props.item.setStartTime(value)
  }
}

@observer
class VolumeSlider extends React.Component {
  render () {
    const item = this.props.item
    const volumeInPercentage = parseInt(item.volume*100)

    return (
      <div style={styles.sliderContainer}>
       <span>{translate("vreditor").volume}</span>
       <span style={styles.sliderCount}> {volumeInPercentage}% </span>
       <Slider
         min={0}
         max={1}
         value={item.volume}
         className="circleobject-slider"
         onDragStop={item.updateObjectServer}
         onChange={this.onChange}
         style={styles.slider}
         sliderStyle={styles.sliderStyle}
       />
      </div>
    )
  }

  onChange = (e,value) => {
    this.props.item.setVolume(value)
  }
}

@observer
class DistanceSlider extends React.Component {
  render () {
    const item = this.props.item

    let value = translate("vreditor").veryNear
    if (item.placement === 1) value = translate("vreditor").veryNear
    else if (item.placement === 2) value = translate("vreditor").near
    else if (item.placement === 3) value = translate("vreditor").far

    return (
      <div style={styles.sliderContainer}>
       <span>{translate("vreditor").distance}</span>
       <span style={styles.sliderCount}>{value}</span>
       <Slider
         min={1}
         max={3}
         step={1}
         value={item.placement}
         className="circleobject-slider"
         onDragStop={item.updateObjectServer}
         onChange={this.onChange}
         style={styles.slider}
         sliderStyle={styles.sliderStyle}
       />
      </div>
    )
  }

  onChange = (e,value) => {
    this.props.item.setPlacement(value)
  }
}

@observer
class CircleObjectSlider extends React.Component {
  render () {
    const isScale = this.props.type === 'scale'
    const item = this.props.item
    let raiseMin = !isScale ? -9 : 1

    return (
      <div style={styles.sliderContainer}>
       <span>{isScale ? translate("vreditor").size : translate("vreditor").height}</span>
       <span style={styles.sliderCount}>{isScale ? item.scale : item.raise}</span>
        <Slider
          min={raiseMin}
          max={9}
          step={1}
          value={isScale ? item.scale : item.raise}
          className="circleobject-slider"
          onDragStop={item.updateObjectServer}
          onChange={this.onChange.bind(this)}
          style={styles.slider}
          sliderStyle={styles.sliderStyle}
        />
      </div>
    )
  }

  onChange (e,value) {
    this.props.type === 'scale' ? this.props.item.setScale(value) : this.props.item.setRaise(value)
  }

}

@observer
class TextToSpeechElement extends React.Component {
  render () {
    const item = this.props.item
    const ui = stores.ui.circleobject

    return (
      <div style={{marginBottom:20}}>
       {item.type !== 'text' &&
         <TextField
          hintText={translate("vreditor").saySomething}
          multiLine={true}
          fullWidth={true}
          rows={1}
          rowsMax={4}
          onChange={this.onChange.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onFocus={ui.toggleTextFocus}
          value={item.text}
         />
       }
       {item.type === 'image' &&
        <div>
         <Toggle
          label={translate("vreditor").tts}
          defaultToggled={!!+item.tts}
          onToggle={this.onToggle.bind(this)}
         />
         <Divider />
        </div>
       }
      </div>
    )
  }

  onToggle (e,value) {
    this.props.item.setTTSServer(value)
  }

  onChange (e,value) {
    this.props.item.setText(value)
  }

  onBlur () {
    if (this.props.item.text !== "") {
      stores.ui.circleobject.toggleTextFocus()
      this.props.item.updateObjectServer()
    }
  }


}


export default CircleObjectMenu
