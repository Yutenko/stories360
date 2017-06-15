var db = require('./db')
db = new db();
var mailer = require('./mail')

exports = module.exports = function (io) {

  // socket server
  io.MESSAGES = {}
  io.MESSAGES.INIT_APP = 1
  io.MESSAGES.UPDATE_TITLE = 2
  io.MESSAGES.UPDATE_SUBTITLE = 3
  io.MESSAGES.UPDATE_BACKGROUNDIMAGE_PATH = 4
  io.MESSAGES.UPDATE_BACKGROUNDIMAGE_TYPE = 5
  io.MESSAGES.DELETE_BACKGROUNDIMAGE = 6
  io.MESSAGES.ADD_OBJECT = 7
  io.MESSAGES.UPDATE_OBJECT = 8
  io.MESSAGES.DELETE_OBJECT = 9
  io.MESSAGES.UPDATE_BACKGROUNDAUDIO_PATH = 10
  io.MESSAGES.UPDATE_BACKGROUNDAUDIO_VOLUME = 11
  io.MESSAGES.DELETE_BACKGROUNDAUDIO = 12
  io.MESSAGES.INIT_SCENE = 13
  io.MESSAGES.SET_PUBLIC = 14
  io.MESSAGES.GET_PUBLIC_SCENES = 15
  io.MESSAGES.ADD_SCENE_TO_STORY = 16
  io.MESSAGES.DELETE_SCENE_FROM_STORY = 17
  io.MESSAGES.UPDATE_DESCRIPTION = 18
  io.MESSAGES.UPDATE_SCENE_ORDER = 19
  io.MESSAGES.SEND_MAIL = 20
  io.MESSAGES.SEND_MAIL_SHARING = 21
  io.MESSAGES.SEARCH_BY_URL = 22
  io.MESSAGES.SEND_MAIL_ACCESSDATA = 23
  io.MESSAGES.LIKE_SCENE = 24
  io.MESSAGES.SEND_MAIL_FLAG_SCENE = 25
  io.MESSAGES.DASHBOARD_LOGIN = 26
  io.MESSAGES.DASHBOARD_SCENE_GET = 27
  io.MESSAGES.DASHBOARD_SCENE_DELETE = 28


  io.on('connection', function (socket) {

   socket.on(io.MESSAGES.INIT_APP, function (data,cb) {
    if (data.uid) {
     socket.join(data.uid)
     db.initApp(data.uid, function () {
      db.getApp(data.uid, cb)
     })
    }
   })

   socket.on(io.MESSAGES.SET_PUBLIC, function (data,cb) {
     db.updatePublic(data,data.id,cb)
   })

   socket.on(io.MESSAGES.DASHBOARD_SCENE_DELETE, function (data,cb) {
     if (data.uid) {
       db.updateDelete(data.uid,cb)
     } else cb(null)
   })

   socket.on(io.MESSAGES.DASHBOARD_SCENE_GET, function (data,cb) {
     if (data.id) {
       db.getDashboardSceneConfig(data.id, cb)
     } else cb('SCENE_FAILED')
   })

   socket.on(io.MESSAGES.DASHBOARD_LOGIN, function (data,cb) {
   // hardcoded user
   const user = "SETUSERNAMEHERE"
   const pw = "SETUSERPASSWORDHERE"
     if (data.user !== "" && data.pw !== "") {
       if (data.user === user && data.pw === pw) {
         cb('LOGIN_SUCCESS')
       } else cb('LOGIN_FAILED')
     } else cb('LOGIN_FAILED')
   })

   socket.on(io.MESSAGES.SEARCH_BY_URL, function (data,cb) {
     if (data.uid) {
       db.getSceneByRandomId(data.id, function (scene) {
         db.addScene(data.share_uid_public,scene.share_uid_public,function () {
           cb (scene)
         })
       })
     }
   })

   socket.on(io.MESSAGES.LIKE_SCENE, function (data,cb) {
     if (data.share_uid_public) {
      db.addLike(data.share_uid_public,cb)
     }
   })

   socket.on(io.MESSAGES.SEND_MAIL, function (data,cb) {
     mailer.sendMail(data,cb)
   })

   socket.on(io.MESSAGES.SEND_MAIL_SHARING, function (data,cb) {
     mailer.sendMailSharing(data,cb)
   })

   socket.on(io.MESSAGES.SEND_MAIL_ACCESSDATA, function (data,cb) {
     if (data.uid) {
       mailer.sendMailAccessData(data,cb)
     }
   })

   socket.on(io.MESSAGES.SEND_MAIL_FLAG_SCENE, function (data,cb) {
     if (data.share_uid_public) {
      mailer.sendFlagMail(data,cb)
     }
   })

   socket.on(io.MESSAGES.UPDATE_SCENE_ORDER, function (data,cb) {
     if (data.uid) {
      db.updateSceneOrder(data.share_uid_public,data.order)
      io.to(data.uid).emit(io.MESSAGES.UPDATE_SCENE_ORDER,data)
     }
   })

   socket.on(io.MESSAGES.INIT_SCENE, function (data,cb) {
    db.getAppScene(data,function (app) {
      if (app.uid) {
       socket.join(app.uid)
      }
      cb(app)
    })
   })

   socket.on(io.MESSAGES.UPDATE_DESCRIPTION, function (data,cb) {
     if (data.uid) {
      db.updateDescription(data,data.uid)
      io.to(data.uid).emit(io.MESSAGES.UPDATE_DESCRIPTION,data)
     }
   })

   socket.on(io.MESSAGES.UPDATE_TITLE, function (data,cb) {
    if (data.uid) {
     db.updateTitle(data,data.uid)
     io.to(data.uid).emit(io.MESSAGES.UPDATE_TITLE,data)
    }
   })

   socket.on(io.MESSAGES.UPDATE_SUBTITLE, function (data,cb) {
    if (data.uid) {
     db.updateSubtitle(data,data.uid)
     io.to(data.uid).emit(io.MESSAGES.UPDATE_SUBTITLE,data)
    }
   })

   socket.on(io.MESSAGES.UPDATE_BACKGROUNDIMAGE_PATH, function (data,cb) {
     if (data.uid) {
       db.addBackground(data.path,data.uid)
       io.to(data.uid).emit(io.MESSAGES.UPDATE_BACKGROUNDIMAGE_PATH,data)

     }
   })

   socket.on(io.MESSAGES.UPDATE_BACKGROUNDIMAGE_TYPE, function (data,cb) {
     if (data.uid) {
       db.updateBackgroundImageType(data.type,data.uid)
       io.to(data.uid).emit(io.MESSAGES.UPDATE_BACKGROUNDIMAGE_TYPE,data)
     }
   })

   socket.on(io.MESSAGES.DELETE_BACKGROUNDIMAGE, function (data,cb) {
     if (data.uid) {
       db.addBackground("",data.uid)
       io.to(data.uid).emit(io.MESSAGES.DELETE_BACKGROUNDIMAGE,data)
     }
   })

   socket.on(io.MESSAGES.ADD_OBJECT, function (data,cb) {
     if (data.uid) {
       db.addEntity(data,data.uid,cb)
       io.to(data.uid).emit(io.MESSAGES.ADD_OBJECT,data)
     }
   })

   socket.on(io.MESSAGES.UPDATE_OBJECT, function (data,cb) {
     if (data.uid) {
       db.updateEntity(data,data.uid,cb)
       io.to(data.uid).emit(io.MESSAGES.UPDATE_OBJECT,data)
     }
   })

   socket.on(io.MESSAGES.DELETE_OBJECT, function (data,cb) {
     if (data.uid) {
       db.deleteEntity(data,data.uid,cb)
       io.to(data.uid).emit(io.MESSAGES.DELETE_OBJECT,data)
     }
   })

   socket.on(io.MESSAGES.UPDATE_BACKGROUNDAUDIO_PATH, function (data,cb) {
     if (data.uid) {
       db.addBackgroundAudio(data.path,data.uid,cb)
       io.to(data.uid).emit(io.MESSAGES.UPDATE_BACKGROUNDAUDIO_PATH,data)
     }
   })

   socket.on(io.MESSAGES.UPDATE_BACKGROUNDAUDIO_VOLUME, function (data,cb) {
     if (data.uid) {
       db.updateBackgroundaudioVolume(data.volume,data.uid,cb)
       io.to(data.uid).emit(io.MESSAGES.UPDATE_BACKGROUNDAUDIO_VOLUME,data)
     }
   })

   socket.on(io.MESSAGES.DELETE_BACKGROUNDAUDIO, function (data,cb) {
     if (data.uid) {
       db.addBackgroundAudio("",data.uid,cb)
       io.to(data.uid).emit(io.MESSAGES.DELETE_BACKGROUNDAUDIO,data)
     }
   })

   socket.on(io.MESSAGES.SET_PUBLIC, function (data,cb) {
     if (data.uid) {
       db.updatePublic(data,data.uid,cb)
       io.to(data.uid).emit(io.MESSAGES.SET_PUBLIC,data)
     }
   })

   socket.on(io.MESSAGES.GET_PUBLIC_SCENES, function (data,cb) {
     db.getPublicScenes(data.keyword,data.offset,cb)
   })

   socket.on(io.MESSAGES.ADD_SCENE_TO_STORY, function (data,cb) {
     if (data.uid) {
       db.addScene(data.app,data.app_linked,cb)
       io.to(data.uid).emit(io.MESSAGES.ADD_SCENE_TO_STORY,data)
     }
   })

   socket.on(io.MESSAGES.DELETE_SCENE_FROM_STORY, function (data,cb) {
     if (data.uid) {
       db.removeScene(data.app,data.app_linked,cb)
       io.to(data.uid).emit(io.MESSAGES.DELETE_SCENE_FROM_STORY,data)
     }
   })

  })

}
