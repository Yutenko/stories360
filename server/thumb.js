var sharp = require('sharp')
var superagent = require('superagent')
var fs = require('fs')
var sizeOf = require('image-size');


function AThumbnail () {}

AThumbnail.prototype.createThumbnail = function (uid,originalPath,width,cb) {
 const destination = './client/uploads/'+uid+'/thumb_' + originalPath.substring(originalPath.lastIndexOf('/')+1)
 width = width ? width : 700

 sharp(originalPath)
  .resize(width)
  .toFile(destination, function (err,info) {
   if (cb) cb()
  })
}

AThumbnail.prototype.optimizeImage = function (uid,originalPath,cb) {
 var self = this

 sizeOf(originalPath, function (err, dimensions) {
  let pow2Width = self.nearestPow2(dimensions.width)
  let pow2Height = self.nearestPow2(dimensions.height)

  pow2Width = pow2Width > dimensions.width ? pow2Width / 2 : pow2Width
  pow2Height = pow2Height > dimensions.heigth ? pow2Height / 2 : pow2Height

  const resizeTo = pow2Width + "x" + pow2Height
  superagent
   .post("https://im2.io/pgwrkgmlrh/"+resizeTo+",stretch/http://stories360.org/" + originalPath)
   .end(function (err,res) {
     const destination = './client/uploads/'+uid+'/optimized_' + originalPath.substring(originalPath.lastIndexOf('/')+1)
     fs.writeFile(destination, res.body, function () {
       console.log(destination);
       if (cb) cb()
     })
   })
 })
}

AThumbnail.prototype.nearestPow2 = function (aSize,cb) {
  return Math.pow( 2, Math.round( Math.log( aSize ) / Math.log( 2 ) ) )
}

module.exports = AThumbnail
