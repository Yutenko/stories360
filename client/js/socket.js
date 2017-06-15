import {getUrlParameter} from './helper'

let socket = null

let MESSAGES = {}
MESSAGES.INIT_APP = 1
MESSAGES.UPDATE_TITLE = 2
MESSAGES.UPDATE_SUBTITLE = 3
MESSAGES.UPDATE_BACKGROUNDIMAGE_PATH = 4
MESSAGES.UPDATE_BACKGROUNDIMAGE_TYPE = 5
MESSAGES.DELETE_BACKGROUNDIMAGE = 6
MESSAGES.ADD_OBJECT = 7
MESSAGES.UPDATE_OBJECT = 8
MESSAGES.DELETE_OBJECT = 9
MESSAGES.UPDATE_BACKGROUNDAUDIO_PATH = 10
MESSAGES.UPDATE_BACKGROUNDAUDIO_VOLUME = 11
MESSAGES.DELETE_BACKGROUNDAUDIO = 12
MESSAGES.INIT_SCENE = 13
MESSAGES.SET_PUBLIC = 14
MESSAGES.GET_PUBLIC_SCENES = 15
MESSAGES.ADD_SCENE_TO_STORY = 16
MESSAGES.DELETE_SCENE_FROM_STORY = 17
MESSAGES.UPDATE_DESCRIPTION = 18
MESSAGES.UPDATE_SCENE_ORDER = 19
MESSAGES.SEND_MAIL = 20
MESSAGES.SEND_MAIL_SHARING = 21
MESSAGES.SEARCH_BY_URL = 22
MESSAGES.SEND_MAIL_ACCESSDATA = 23
MESSAGES.LIKE_SCENE = 24
MESSAGES.SEND_MAIL_FLAG_SCENE = 25
MESSAGES.DASHBOARD_LOGIN = 26
MESSAGES.DASHBOARD_SCENE_GET = 27
MESSAGES.DASHBOARD_SCENE_DELETE = 28



if (!socket) {
 socket = io()
 socket.MESSAGES = MESSAGES
 socket.sendMessage = function (MSG,data,cb) {
  data = data ? data : {}
  data.from = socket.id
  data.uid = data.uid ? data.uid : getUrlParameter("vr")
  if (cb) {
   socket.emit(MSG,data,cb)
  } else socket.emit(MSG,data)
 }
 socket.addPrivateRealtimeUpdates = addPrivateRealtimeUpdates
 socket.addPublicRealtimeUpdates = addPublicRealtimeUpdates
}

function addPrivateRealtimeUpdates (cfg) {
  socket.on(socket.MESSAGES.UPDATE_TITLE,cfg.onUpdateTitle)
  socket.on(socket.MESSAGES.UPDATE_SUBTITLE,cfg.onUpdateSubtitle)
  socket.on(socket.MESSAGES.UPDATE_DESCRIPTION,cfg.onUpdateDescription)
  socket.on(socket.MESSAGES.ADD_OBJECT,cfg.onAddObject)
  socket.on(socket.MESSAGES.UPDATE_OBJECT,cfg.onUpdateObject)
  socket.on(socket.MESSAGES.DELETE_OBJECT,cfg.onDeleteObject)
  socket.on(socket.MESSAGES.UPDATE_BACKGROUNDIMAGE_PATH,cfg.onUpdateBackgroundimagePath)
  socket.on(socket.MESSAGES.UPDATE_BACKGROUNDIMAGE_TYPE,cfg.onUpdateBackgroundimageType)
  socket.on(socket.MESSAGES.DELETE_BACKGROUNDIMAGE,cfg.onDeleteBackgroundimage)
  socket.on(socket.MESSAGES.UPDATE_BACKGROUNDAUDIO_PATH,cfg.onUpdateBackgroundaudioPath)
  socket.on(socket.MESSAGES.UPDATE_BACKGROUNDAUDIO_VOLUME,cfg.onUpdateBackgroundaudioVolume)
  socket.on(socket.MESSAGES.DELETE_BACKGROUNDAUDIO,cfg.onDeleteBackgroundaudio)
  socket.on(socket.MESSAGES.ADD_SCENE_TO_STORY,cfg.onAddSceneToStory)
  socket.on(socket.MESSAGES.DELETE_SCENE_FROM_STORY,cfg.onDeleteSceneFromStory)
  socket.on(socket.MESSAGES.UPDATE_SCENE_ORDER,cfg.onUpdateSceneOrder)
}

function addPublicRealtimeUpdates (cfg) {
  socket.on(socket.MESSAGES.SET_PUBLIC,cfg.onSetPublic)
}




export default socket
