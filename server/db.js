var mysql = require('mysql')
var shortid = require('shortid')

var pool = null

if (!pool) {
 pool = mysql.createPool({
  host     : '127.0.0.1',
  user     : 'MYSQLUSERNAME',
  password : 'MYSQLPASSWORD',
  database : 'webvr'
 })
}

function ADataBase() {}

ADataBase.prototype.query = function (sql,cb) {
 pool.query(sql,function (err,results) {
  return cb(err,results)
 })
}

ADataBase.prototype.initApp = function (uid,cb) {
 // use IGNORE for UNIQUE Constraint on UID
 var sql = 'INSERT IGNORE INTO apps (UID,share_uid_public,share_uid_private) VALUES ("'+uid+'","'+shortid.generate()+'","'+shortid.generate()+'")'
 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.checkBackgroundAudio = function (uid,cb) {
 var sql = "SELECT fk_backgroundaudio FROM apps WHERE uid = '" + uid + "'"
 this.query(sql,function (err,result) {
  cb(result)
 })
}

ADataBase.prototype.updateBackgroundaudioVolume = function (volume,uid,cb) {
 var self = this

 this.checkBackgroundAudio(uid,function (result) {
  var sql = ""
  // bgaudio exists, update
  var fk_backgroundaudio = result && result[0] ? result[0].fk_backgroundaudio : 0
  if (fk_backgroundaudio > 0) {
   sql = "UPDATE backgroundaudios SET volume = " + volume + ", lastupdate = NOW() WHERE id = " + fk_backgroundaudio
   self.query(sql,function (err,result) {
    if (cb) cb(result)
   })
  }
 })
}

ADataBase.prototype.addBackgroundAudio = function (path,uid,cb) {
 var self = this

 this.checkBackgroundAudio(uid,function (result) {
  var sql = ""
  // bgaudio exists, update
  var fk_backgroundaudio = result && result[0] ? result[0].fk_backgroundaudio : 0
  if (fk_backgroundaudio > 0) {
   sql = "UPDATE backgroundaudios SET path = " + pool.escape(path) + ", lastupdate = NOW() WHERE id = " + fk_backgroundaudio
   self.query(sql,function (err,r) {
    if (cb) cb(r)
   })
  } else {
   // bgimg doesnt exist, insert
   sql = "INSERT INTO backgroundaudios (path,lastupdate) VALUES('"+path+"',NOW())"
   self.query(sql,function (err,r) {
    self.updateBackgroundAudio(r.insertId,uid,cb)
   })
  }

 })

}

ADataBase.prototype.checkBackground = function (uid,cb) {
 var sql = "SELECT fk_backgroundimage FROM apps WHERE uid = '" + uid + "'"
 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.addBackground = function (path,uid,cb) {
 var self = this

 this.checkBackground(uid,function (result) {
  var sql = ""

  // bgimg exists, update
  var fk_backgroundimage = result && result[0] ? result[0].fk_backgroundimage : 0
  if (fk_backgroundimage > 0) {
   sql = "UPDATE backgroundimages SET path = '" + path + "', lastupdate = NOW() WHERE id = " + fk_backgroundimage
   self.query(sql,function (err,r) {
    if (cb) cb(r)
   })
  } else {
   // bgimg doesnt exist, insert
   sql = "INSERT INTO backgroundimages (fk_type,path,lastupdate) VALUES(1,"+pool.escape(path)+",NOW())"
   self.query(sql,function (err,r) {
    self.updateBackground(r.insertId,uid,function (re) {
      if (cb) cb(re)
    })
   })
  }

 })
}

ADataBase.prototype.updateDelete = function (uid,cb) {
  const sql = "UPDATE apps SET deleted = !deleted, deletedAt = NOW() WHERE uid = '" + uid + "'"

  this.query(sql,function (err,result) {
   if (cb) cb(result)
  })
}

ADataBase.prototype.updatePublic = function (data,uid,cb) {
  const pub = data.public ? 1 : 0
  let sql = ""
  if (pub) {
    sql = "UPDATE apps SET public = " + pub + ", lastupdate = NOW(), published = NOW() WHERE uid = '" + uid + "'"
  } else {
    sql = "UPDATE apps SET public = " + pub + ", lastupdate = NOW() WHERE uid = '" + uid + "'"
  }

  this.query(sql,function (err,result) {
   if (cb) cb(result)
  })
}

ADataBase.prototype.updateTitle = function (data,uid,cb) {
 var sql = "UPDATE apps SET title = " + pool.escape(data.src) + ", lastupdate = NOW() WHERE uid = '" + uid + "'"
 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.updateSubtitle = function (data,uid,cb) {
 var sql = "UPDATE apps SET subtitle = " + pool.escape(data.src) + ", lastupdate = NOW() WHERE uid = '" + uid + "'"
 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.updateDescription = function (data,uid,cb) {
 var sql = "UPDATE apps SET title = " + pool.escape(data.title) + ", subtitle = " + pool.escape(data.subtitle) + ", lastupdate = NOW() WHERE uid = '" + uid + "'"
 this.query(sql, function (err,result) {
   if (cb) cb(result)
 })
}

ADataBase.prototype.updateBackground = function (fk_backgroundimage,uid,cb) {
 var sql = "UPDATE apps SET fk_backgroundimage = " + fk_backgroundimage + ", lastupdate = NOW() WHERE uid = '" + uid + "'"
 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.updateBackgroundAudio = function (fk_backgroundaudio,uid,cb) {
 var sql = "UPDATE apps SET fk_backgroundaudio = " + fk_backgroundaudio + ", lastupdate = NOW() WHERE uid = '" + uid + "'"
 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.getEntityType = function (entity) {
 var toTest = null
 var type = -1

 if (entity.type) toTest = entity.type
 else if (entity.fk_type) toTest = entity.fk_type

 if (toTest) {
  if (toTest === 'text') type = 1
  else if (toTest === 'image') type = 2
  else if (toTest === 'audio') type = 3
  else if (toTest === 'video') type = 4
 }

 return type
}

ADataBase.prototype.addEntity = function (entity,uid,cb) {
 if (!entity.youtubemaxduration || entity.youtubemaxduration == 'undefined') entity.youtubemaxduration = 0
 var sql = "INSERT INTO objects (src,fk_apps,fk_type,youtubemaxduration,lastupdate) VALUES("+pool.escape(entity.src)+",'"+uid+"',"+this.getEntityType(entity)+","+entity.youtubemaxduration+",NOW())"

 this.query(sql,function (err,result) {
  entity.placement = 2 // default placement
  entity.id = result.insertId
  if (cb) cb(entity)
 })
}

ADataBase.prototype.updateEntity = function (entity,uid,cb) {
 var sql = "UPDATE objects SET "

 if (entity.src) sql += "src = "+pool.escape(entity.src)+","
 if (entity.type || entity.fk_type) sql += "fk_type = "+this.getEntityType(entity)+","
 if (entity.placement) sql += "fk_placement = "+entity.placement+","
 if (entity.rotate || entity.rotate === 0) sql += "rotate = "+entity.rotate+","
 if (entity.scale || entity.scale === 0) sql += "scale = "+entity.scale+","
 if (entity.raise || entity.raise === 0) sql += "raise = "+entity.raise+","
 if (entity.text && entity.text !== "") sql += "text = "+pool.escape(entity.text)+","
 if (entity.tts || entity.tts === 0 || entity.tts === false) {
   entity.tts = entity.tts === false ? 0 : 1
   sql += "tts = "+entity.tts+","
 }
 if (entity.youtubemaxduration || entity.youtubemaxduration === 0) sql += "youtubemaxduration = "+entity.youtubemaxduration+","
 if (entity.youtubestarttime || entity.youtubestarttime === 0) sql += "youtubestarttime = "+entity.youtubestarttime+","
 if (entity.volume || entity.volume === 0) sql += "volume = "+entity.volume+","

 sql += "lastupdate = NOW(),"
 sql = sql.substring(0, sql.length-1)
 sql += " WHERE id = " + entity.id + " AND fk_apps = '" + uid + "'"

 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.getApp = function (uid,cb) {
 var self = this

 self.getAppByUID(uid,function (app) {
  app = app[0]
  if (app.deleted == 1) {
    cb({deleted_access:true})
  } else self.getAppContent(app,cb)
 })
}

ADataBase.prototype.getPDFData = function (uid,cb) {
  var self = this
  this.getAppByUID(uid,function (app) {
    app = app[0]
    self.getBackgroundimageById(app.fk_backgroundimage,function (bg) {
      app.backgroundimage = bg && bg[0] ? bg[0].path : null
      cb(app)
    })
  })
}

ADataBase.prototype.addView = function (share_uid_public,cb) {
  var sql = "UPDATE apps SET views = views + 1, lastview = NOW() WHERE share_uid_public = '" + share_uid_public + "'"
  this.query(sql, function (err,result) {
    if (cb) cb()
  })
}

ADataBase.prototype.addLike = function (share_uid_public,cb) {
  var sql = "UPDATE apps SET likes = likes + 1 WHERE share_uid_public = '" + share_uid_public + "'"
  this.query(sql, function (err,result) {
    if (cb) cb()
  })
}

ADataBase.prototype.getAppScene = function (data,cb) {
 var self = this

 self.getAppByShareUID(data,function (app) {
  app = app[0]

  if (app.deleted == 1) return cb({deleted_access:true})

  if (data.public) {
    if (!app.public) {
      return cb({invalid_access:true})
    } else {
      // is public, add a view
      self.addView(data.uid)
    }
  }

  self.getAppContent(app,cb)
 })
}

ADataBase.prototype.getAppContent = function (app,cb) {
  var self = this

  self.getBackgroundimageById(app.fk_backgroundimage, function (bg) {
   self.getBackgroundaudioById(app.fk_backgroundaudio, function (bga) {
    self.getObjectsByAppUID(app.uid,function (objects) {
      self.getScenesByAppUID(app.share_uid_public, function (scenes) {

        delete app.fk_backgroundimage
        delete app.fk_backgroundaudio
        app.backgroundimage = bg[0]
        app.backgroundaudio = bga[0]
        app.objects = objects
        app.scenes = scenes ? scenes : []
        cb(app)

      })
    })
   })
  })
}

ADataBase.prototype.getScenesByAppUID = function (share_uid_public,cb) {
  var sql = "SELECT apps.title, apps.subtitle, apps.share_uid_public, apps.share_uid_private, backgroundimages.path AS image " +
            "FROM apps " +
            "INNER JOIN scenes ON apps.share_uid_public = scenes.apps_linked " +
            "INNER JOIN backgroundimages ON backgroundimages.id = apps.fk_backgroundimage " +
            "WHERE scenes.app = '" + share_uid_public + "'" +
            "ORDER BY scenes.sequence ASC"

 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}


ADataBase.prototype.getAppByUID = function (uid,cb) {
 var sql = "SELECT uid,share_uid_public,share_uid_private,public,title,deleted,subtitle,fk_backgroundimage,fk_backgroundaudio FROM apps WHERE uid = '" + uid + "'"
 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.getAppByShareUID = function (data,cb) {
  var uid = data.public ? "share_uid_public" : "share_uid_private"
  var sql = "SELECT uid,share_uid_public,share_uid_private,title,subtitle,likes,deleted,fk_backgroundimage,fk_backgroundaudio,public FROM apps WHERE "+uid+" = '" + data.uid + "'"
  this.query(sql,function (err,result) {
   if (cb) cb(result)
  })
}

ADataBase.prototype.getBackgroundimageById = function (id,cb) {
 var sql = "SELECT backgroundimages.path AS path, backgroundimages_types.type AS type FROM backgroundimages INNER JOIN backgroundimages_types ON backgroundimages.fk_type = backgroundimages_types.id WHERE backgroundimages.id = " + id
 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.getBackgroundaudioById = function (id,cb) {
 var sql = "SELECT path,volume FROM backgroundaudios WHERE id = " + id
 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.getObjectsByAppUID = function (uid,cb) {
 var sql = "SELECT objects.id,objects.src,objects.rotate,objects.scale,objects.raise,objects_placement.placement,objects_types.type,objects.text,objects.tts,objects.youtubestarttime,objects.youtubemaxduration,objects.volume " +
           "FROM objects " +
           "INNER JOIN objects_placement ON objects.fk_placement = objects_placement.id " +
           "INNER JOIN objects_types ON objects.fk_type = objects_types.id " +
           "WHERE objects.fk_apps = '" + uid + "'"

 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })

}

ADataBase.prototype.deleteEntity = function (data,uid,cb) {
 var sql = "DELETE FROM objects WHERE id = " + data.id + " AND fk_apps = '" + uid + "'"

 this.query(sql,function (err,result) {
  if (cb) cb(result)
 })
}

ADataBase.prototype.updateBackgroundImageType = function (type,uid,cb) {
 var self = this

 this.checkBackground(uid,function (result) {
  var fk_backgroundimage = result && result[0] ? result[0].fk_backgroundimage : 0
  if (fk_backgroundimage > 0) {
   var fk_type = type === "360" ? 2 : 1
   var sql = "UPDATE backgroundimages SET fk_type = " + fk_type + ", lastupdate = NOW() WHERE id = " + fk_backgroundimage
   self.query(sql,function (err,result) {

    if (cb) cb(type)
   })
  }
 })
}

ADataBase.prototype.getSceneByRandomId = function (id,cb) {
  var sql = "SELECT apps.share_uid_public, apps.title, apps.subtitle, backgroundimages.path AS image " +
            "FROM apps " +
            "INNER JOIN backgroundimages ON backgroundimages.id = apps.fk_backgroundimage " +
            "WHERE uid = '"+id+"' OR share_uid_public = '"+id+"' OR share_uid_private = '"+id+"'"
            "LIMIT 1"

  this.query(sql, function (err,result) {
    if (cb && result) cb(result[0])
  })
}

ADataBase.prototype.getDashboardSceneConfig = function (id,cb) {
  var sql = "SELECT uid,share_uid_public,share_uid_private,public,deleted " +
            "FROM apps " +
            "WHERE uid = '"+id+"' OR share_uid_public = '"+id+"' OR share_uid_private = '"+id+"'"
            "LIMIT 1"

  this.query(sql, function (err,result) {
    if (cb && result) cb(result[0])
  })
}

ADataBase.prototype.getPublicScenes = function (keyword,offset,cb) {
  var sql = "SELECT apps.share_uid_public, apps.title, apps.subtitle, backgroundimages.path AS image, apps.views, apps.published " +
            "FROM apps " +
            "INNER JOIN backgroundimages ON backgroundimages.id = apps.fk_backgroundimage " +
            "WHERE apps.public = 1 AND apps.deleted = 0 " +
            (keyword&&keyword!==''?"AND MATCH (apps.title,apps.subtitle) AGAINST ('"+keyword+"*' IN BOOLEAN MODE) " : " ") +
            "ORDER BY apps.published DESC " +
            "LIMIT 15 " +
            "OFFSET " + (offset ? offset : 0)

  this.query(sql, function (err,result) {
    if (cb) cb(result)
  })
}

ADataBase.prototype.getLastSequenceIndex = function (share_uid_public,cb) {
  var sql = "SELECT sequence FROM scenes WHERE app = '" + share_uid_public + "' ORDER BY sequence DESC LIMIT 1"
  this.query(sql, function (err,result) {
    result = result.length > 0 ? result[0].sequence : 0
    if (cb) cb(result)
  })
}


ADataBase.prototype.addScene = function (app,app_linked,cb) {
 var self = this

 this.getLastSequenceIndex(app,function (lastIndex) {
   var sql = "INSERT INTO scenes (app,apps_linked,sequence) VALUES ('"+app+"','"+app_linked+"',"+(lastIndex+1)+")"
   self.query(sql, function (err,result) {
     if (cb) cb(result)
   })
 })
}

ADataBase.prototype.removeScene = function (app,app_linked,cb) {
  var self = this
  var sql = "DELETE FROM scenes WHERE app = '" + app + "' AND apps_linked = '" + app_linked + "'"

  this.query(sql, function (err,result) {
    self.getScenesForReorder(app,function (oldOrder) {
      self.updateSceneOrder(app,oldOrder,function () {
        if (cb) cb(result)
      })
    })
  })
}

ADataBase.prototype.updateSceneOrder = function (app,newOrder,cb) {
  for (var i = 0,lastIndex = 1; i < newOrder.length; i++,lastIndex++) {
    this.updateSequence(app,newOrder[i].apps_linked,lastIndex)
  }
}

ADataBase.prototype.updateSequence = function (app,app_linked,sequence,cb) {
  var sql = "UPDATE scenes SET sequence = " + sequence + " WHERE app = '" + app + "' AND apps_linked = '" + app_linked + "'"
  this.query(sql, function (err,result) {
    if (cb) cb(result)
  })
}

ADataBase.prototype.getScenesForReorder = function (app,cb) {
  var sql = "SELECT apps_linked FROM scenes WHERE app = '" + app + "' ORDER BY sequence ASC"
  this.query(sql, function (err,result) {
    if (cb) cb(result)
  })
}





/*
fast copy

TRUNCATE apps;
TRUNCATE backgroundaudios;
TRUNCATE backgroundimages;
TRUNCATE objects;
TRUNCATE scenes;

*/


module.exports = ADataBase
