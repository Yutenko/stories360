var express = require('express');
var app = express.Router();
var upload = require('./storage')
var path = require('path')
var io = require( '../server')
var db = require('./db')
var pdfCreator = require('./pdf')
var thumbnailer = require('./thumb')

pdfCreator = new pdfCreator()
db = new db()
thumbnailer = new thumbnailer()


// image uploads
app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {
 var uid = req.body.vr ? req.body.vr : false
 var type = req.body.type ? req.body.type : false

 if (uid && type) {
  if (type === 'background') {
   db.addBackground(req.file.path,uid, function () {
    var data = {path:req.file.path}
    thumbnailer.createThumbnail(uid,req.file.path,700)
    io.to(uid).emit(io.MESSAGES.UPDATE_BACKGROUNDIMAGE_PATH,data)
    res.json(data)
   })
  }
  else if (type === 'entity') {
   var data = {type:'image',src:req.file.path,UID:uid,from:req.body.from}
   db.addEntity(data,uid, function (entity) {
    res.json(entity)
    thumbnailer.createThumbnail(uid,req.file.path,100)
    io.to(uid).emit(io.MESSAGES.ADD_OBJECT,entity)
   })
  }
  else if (type === 'audio') {
   var data = {type:'audio',src:req.file.path,UID:uid,from:req.body.from}
   db.addEntity(data,uid, function (entity) {
    res.json(entity)
    io.to(uid).emit(io.MESSAGES.ADD_OBJECT,entity)
   })
  }
  else if (type === 'video') {
   var data = {type:'video',src:req.file.path,UID:uid,from:req.body.from}
   db.addEntity(data,uid, function (entity) {
    res.json(entity)
    io.to(uid).emit(io.MESSAGES.ADD_OBJECT,entity)
   })
  }
  else if (type === 'background_audio') {
   db.addBackgroundAudio(req.file.path,uid, function () {
    var data = {path:req.file.path}
    res.json(data)
    io.to(uid).emit(io.MESSAGES.UPDATE_BACKGROUNDAUDIO_PATH,data)
   })
  }
 }

})

app.get('/pdf', function (req,res) {
  var uid = req.query.uid ? req.query.uid : ""
  // get pdf for Editor
  if (uid !== "") {
   pdfCreator.createEditorPDF(uid, function (filePath) {
     res.download(filePath)
   })
  }

  else res.redirect('back')
})

app.get('/watch',function (req,res) {
 res.sendFile(path.resolve(__dirname,'../client/views/','vrframe.html'))
})

app.get('/dashboard',function (req,res) {
 res.sendFile(path.resolve(__dirname,'../client/views/','dashboard.html'))
})

// wildcard route (needed for browserhistory on react spa pattern)
app.get('*', function (req, res){
 res.sendFile(path.resolve(__dirname, '../client/views/', 'index.html'))
})


module.exports = app
