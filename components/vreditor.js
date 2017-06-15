import React from 'react'
import {getUrlParameter} from '../client/js/helper'
import Description from './description'
import ImageUpload from './imageupload'
import AudioUpload from './audioupload'
import Circles from './circles'
import SceneEditor from './sceneeditor'
import SceneEditor2 from './sceneeditor2'
import {SharingEditor} from './sharing'
import stores from '../stores/vrestores'
import {Cockpit,ReleaseCockpit} from './cockpit'
import {observer} from 'mobx-react'


@observer
class VREditor extends React.Component {

 render () {
  const ui = stores.ui.showwhen
  const d = document.getElementsByTagName('body')[0]

  if (ui.showReleaseCockpit) {
    d.className = 'overflow-hidden'
  }
  if (ui.showCockpit) {
    d.className = 'overflow-visible'
  }

  return (
   <div style={{top:0,left:0}}>
    {ui.showReleaseCockpit && <ReleaseCockpit />}
    {ui.showCockpit && <Cockpit />}
    <Description />
    <ImageUpload />
    <Circles />
    <AudioUpload />
    <SceneEditor2 />
    {ui.showPublish && <SharingEditor />}
   </div>
  )
 }

 componentWillUnmount () {
   stores.app.resetStore()

   stores.ui.showwhen.reset()
   stores.ui.description.reset()
   stores.ui.imageupload.reset()
   stores.ui.objectupload.reset()
   stores.ui.circleobject.reset()
   stores.ui.audioupload.reset()
   stores.ui.audioplayer.reset()
   stores.ui.youtube.reset()
   stores.ui.ytpreview.reset()
   stores.ui.backgroundaudio.reset()
   stores.ui.sceneeditor.reset()
   stores.ui.circle.reset()
   stores.ui.sharing.reset()
 }

 componentDidMount () {
  const store = stores.app

  var paramVR = getUrlParameter('vr')
  if (!paramVR) {
   this.props.router.push({
    pathname:'vreditor',
    search:'?vr='+store.uid
   })
  }

  store.init(null, () => {
    if (stores.app.backgroundimage && stores.app.backgroundimage.hasImage) {
     stores.ui.showwhen.setReleaseCockpitAcknowledged()
    }
  })
  window.scrollTo(0, 0)
 }

}



export default VREditor
