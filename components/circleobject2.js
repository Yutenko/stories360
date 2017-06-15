import React from 'react'
import {observer} from 'mobx-react'
import CircleObjectMenu from './circleobjectmenu'
import { Draggable } from 'react-drag-and-drop'
import stores from '../stores/vrestores'

const styles = {
  typeOverlay:{
    zIndex:2
  }
}

@observer
class CircleObject2 extends React.Component {

 render () {
  const item = this.props.item

  return (
   <Draggable
    type="o"
    data={item.id}
    onDrag={this.onDrag.bind(this)}
   >
    <div className="circle-pointer" id={"element-"+item.id} style={{
     WebkitTransform : "rotate("+item.getRotation+"deg)",
     MsTransform: "rotate("+item.getRotation+"deg)",
     Transform: "rotate("+item.getRotation+"deg)"
    }}>
     <div className="vr2d-rel">
      <img
       className={"vr2d-icon vr2d-icon-"+this.props.distance+"m"}
       src={item.getImage}
       id={"trigger-"+item.id}
       onClick={this.openMenu.bind(this)}
       style={{
        WebkitTransform : "rotate("+item.getImageRotation+"deg)",
        MsTransform: "rotate("+item.getImageRotation+"deg)",
        Transform: "rotate("+item.getImageRotation+"deg)"
       }}
      />
     </div>
    </div>
   </Draggable>
  )
 }

 componentDidMount () {
   const circle = stores.ui.circle
   circle.playNewObjectSound()
 }

 onDrag (event) {
  const circle = stores.ui.circle
  const mouseX = parseInt(event.clientX - circle.relativePosition.left)
  const mouseY = parseInt(event.clientY - circle.relativePosition.top)

  let theta = Math.atan2(mouseY-circle.center.y,mouseX-circle.center.x)
  if (theta < 0) {
    theta += 2 * Math.PI
  }
  theta = (theta * 180.0 / Math.PI) % 360
  this.props.item.setRotate(theta)
 }

 openMenu (e) {
   e.preventDefault()
   stores.ui.circleobject.handleOpen(e.currentTarget,this.props.item)
 }


}








export default CircleObject2
