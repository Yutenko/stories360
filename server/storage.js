var multer  = require('multer')
var shortid = require('shortid')
var fse = require('fs-extra')
var path = require('path')

var storage = module.exports = multer.diskStorage({
 destination: function (req, file, cb) {
  var uid = req.body.vr ? req.body.vr : false
  var dir = 'client/uploads/'+uid;
  fse.ensureDir(dir, function (err) {
   cb(null, 'client/uploads/'+uid)
  })
 },
 filename: function (req, file, cb) {
  var filename = file.originalname
  if (req.body.type && req.body.type === 'background')
   filename = 'background' + path.extname(file.originalname).toLowerCase()
  else if (req.body.type && req.body.type === 'entity')
   filename = 'entity_' + shortid.generate() + '' + path.extname(file.originalname)
  else if (req.body.type && req.body.type === 'audio')
   filename = 'audio_' + shortid.generate() + '' + path.extname(file.originalname)
  else if (req.body.type && req.body.type === 'video')
   filename = 'video_' + shortid.generate() + '' + path.extname(file.originalname)
  else if (req.body.type && req.body.type === 'background_audio')
   filename = 'background_audio_' + path.extname(file.originalname)


  cb(null, filename)
 }
})

var upload = module.exports = multer({
 storage:storage,
 limits:{
  fileSize: 10 * 1024 * 1024 // file size in bytes = 10MB
 }
})
