import React from 'react'
import {observer} from 'mobx-react'
import CircleObjectMenu from './circleobjectmenu'
import stores from '../stores/vrestores'
import Draggable from "gsap/Draggable"

const styles = {
  typeOverlay:{
    zIndex:2
  }
}

@observer
class CircleObject extends React.Component {

 render () {
  const item = this.props.item
  const ui = stores.ui.circleobject

  return (
    <div className="circle-pointer" key={"element-"+item.id} ref={ (dom) => {ui.setCurrentDragItem(dom)} } style={{
     WebkitTransform : "rotate("+item.getRotation+"deg)",
     MsTransform: "rotate("+item.getRotation+"deg)",
     Transform: "rotate("+item.getRotation+"deg)"
    }}>
     <div className="vr2d-rel">
      <img
       className={"vr2d-icon vr2d-icon-"+this.props.distance+"m"}
       src={item.getImage}
       key={"trigger-"+item.id}
       ref={ (dom) => {ui.setCurrentDragTrigger(dom)} }
       onClick={this.openMenu}
       style={{
        WebkitTransform : "rotate("+item.getImageRotation+"deg)",
        MsTransform: "rotate("+item.getImageRotation+"deg)",
        Transform: "rotate("+item.getImageRotation+"deg)"
       }}
      />
     </div>
    </div>
  )
 }

 componentDidMount () {
   const ui = stores.ui.circleobject
   const item = this.props.item
   const circle = stores.ui.circle

   Draggable.create(ui.currentDragItem, {
     type:'rotation',
     onDrag: function () {
      item.setRotate(this.rotation)
    },
    onDragEnd: function () {
      item.updateObjectServer()
    }
   })

  // circle.playNewObjectSound()
 }


 openMenu = (e) => {
   e.preventDefault()
   stores.ui.circleobject.handleOpen(e.currentTarget,this.props.item)
 }


}








export default CircleObject
