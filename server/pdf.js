var fs = require('fs')
var pdf = require('html-pdf')
var qr = require('qr-image')
var db = require('./db')
db = new db()

function StoriesPDFCreator () {}

StoriesPDFCreator.prototype.createEditorPDF = function (uid,cb) {
  var self = this

  this.createPdf(uid,function (pdf) {
    self.writeToDisk(pdf,uid,cb)
  })
}

StoriesPDFCreator.prototype.writeToDisk = function (html,uid,cb) {
 var createPath = './client/uploads/'+uid+'/stories360.org_'+uid+'.pdf'

 pdf.create(html).toFile(createPath,function(err, res){
  if (err) return console.log(err);
  cb(res.filename)
 })
}

StoriesPDFCreator.prototype.createPdf = function (uid,cb) {
  var self = this

  db.getPDFData(uid,function (data) {
   self.createQrCode(data,'editor',function (qrCodeEditor) {
     self.createQrCode(data,'vr',function (qrCodeVR) {
      self.getPdfMarkup(data,qrCodeEditor,qrCodeVR,cb)
    })
   })
  })
}

StoriesPDFCreator.prototype.getCardboardLink = function (data) {
  return data.public ?
   'http://stories360.org/watch?vr='+data.share_uid_public :
   'http://stories360.org/watch?vr='+data.share_uid_private+'&pr=1'
}

StoriesPDFCreator.prototype.createQrCode = function (data,type,cb) {
  var createPath = "", text = "", backlink = ""
  if (type === 'editor') {
    createPath = './client/uploads/'+data.uid+'/stories360.org.qrcode.png'
    text = 'http://stories360.org/vreditor?vr=' + data.uid
    backlink = 'http://stories360.org/client/uploads/'+data.uid+'/stories360.org.qrcode.png'
  }
  if (type === 'vr') {
    createPath = './client/uploads/'+data.uid+'/stories360.org.qrcode.vr.png'
    text = this.getCardboardLink(data)
    backlink = 'http://stories360.org/client/uploads/'+data.uid+'/stories360.org.qrcode.vr.png'
  }

  var qrCode = qr.image(text)
  var output = fs.createWriteStream(createPath)
  var stream = qrCode.pipe(output)

  stream.on('finish', function () {
   cb(backlink)
  })
}

StoriesPDFCreator.prototype.getPdfMarkup = function (data,qrCodeEditor,qrCodeVR,cb) {
  var image = data.backgroundimage ? 'http://stories360.org/' + data.backgroundimage : 'pseudobild'
  var editorLink = 'http://stories360.org/vreditor?vr=' + data.uid
  var vrLink = this.getCardboardLink(data)
  var logo = 'http://stories360.org/client/images/logo.png'
  var html = ''

   html +=
    '<div style="margin:30px;text-align:center">' +

     '<div style="margin-bottom:5px;font-size:18px;overflow:hidden">' + data.title + ' <strong>bearbeiten</strong> </div>' +
     '<div style="font-style:italic;margin-bottom:5px;font-size:14px;overflow:hidden"> (' + data.subtitle + ') </div>' +
     '<div style="position:relative">' +
      '<img src="'+image+'" style="width:100%;height:256px;margin-bottom:5px" />' +
      '<img src="'+qrCodeEditor+'" style="position:absolute;right:0px;top:0px;width:128px;height:128px"/>' +
      '<img src="'+logo+'" style="width:36px;height:36px;vertical-align:middle;margin-right:10px"/>' +
      '<a href="'+editorLink+'">' + editorLink + '</a>' +
     '</div>' +

     '<div style="border:1px solid rgb(0,0,0);opacity:0.7;border-style:dashed;margin-bottom:20px;margin-top:20px"></div>' +

     '<div style="margin-bottom:5px;font-size:18px;overflow:hidden">' + data.title + ' <strong>ansehen</strong> </div>' +
     '<div style="font-style:italic;margin-bottom:5px;font-size:14px;overflow:hidden"> (' + data.subtitle + ') </div>' +
     '<div style="position:relative">' +
      '<img src="'+image+'" style="width:100%;height:256px;margin-bottom:5px" />' +
      '<img src="'+qrCodeVR+'" style="position:absolute;right:0px;top:0px;width:128px;height:128px"/>' +
      '<img src="'+logo+'" style="width:36px;height:36px;vertical-align:middle;margin-right:10px"/>' +
      '<a href="'+vrLink+'">' + vrLink + '</a>' +
     '</div>' +

    '</div>'


  cb(html)
}

module.exports = StoriesPDFCreator
