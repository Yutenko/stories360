'use strict';
const nodemailer = require('nodemailer');
let pdf = require('./pdf')
pdf = new pdf()

function AMailer () {
  this.service = 'gmail'
  this.auth = {
    user: 'YOURGMAILADRESS',
    pass: 'YOURGMAILPASSWORD'
  }
}

AMailer.prototype.sendMail = function (data,cb) {
  let transporter = nodemailer.createTransport({
      service: this.service,
      auth: this.auth
  })

  let mailOptions = {
      from: data.name + '<'+data.mail+'>',
      to: 'stories360.org@gmail.com',
      subject: 'Anregung, Kritik, Vorschlag',
      text: data.message,
      html: this.createHTMLBody(data)
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
    return console.log(error);
   }
   cb()
  })
}

AMailer.prototype.createHTMLBody = function (data) {
  return '<div>' +
           data.message +
          '<p> Antworte <strong>' + data.name + '</strong> über seine Email-Adresse: ' + data.mail + '</p>'
         '</div>'
}

AMailer.prototype.createHTMLBodySocialSharing = function (data) {
  return '<div>' +
           data.fromWho + ' sendet Dir ' +
         '</div>'
}

AMailer.prototype.createHTMLBodyFlagScene = function (data) {
  const link = 'http://stories360.org/watch?vr='+data.share_uid_public
  return '<p> Für folgende VR Welt wurde ein unpassender Inhalt gemeldet: <a href="'+link+'">' + link + '</a></p>' +
         '<p> Bemerkung: ' + data.message + '</p>'
}

AMailer.prototype.sendMailSharing = function (data,cb) {
  let transporter = nodemailer.createTransport({
      service: this.service,
      auth: this.auth
  })

  let mailOptions = {
      from: 'stories360.org@gmail.com',
      to: data.toWhom,
      subject: 'Schau Dir das mal an',
      html: this.createHTMLBodySocialSharing(data)
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
    return console.log(error);
   }
   cb()
  })
}

AMailer.prototype.sendFlagMail = function (data,cb) {
  let transporter = nodemailer.createTransport({
      service: this.service,
      auth: this.auth
  })

  let mailOptions = {
      from: 'stories360.org@gmail.com',
      to: 'stories360.org@gmail.com',
      subject: 'VR Welt gemeldet!',
      html: this.createHTMLBodyFlagScene(data)
  }

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
    return console.log(error);
   }
   cb()
  })
}

AMailer.prototype.sendMailAccessData = function (data,cb) {
 const self = this
 pdf.createPdf(data.uid,function (html) {
   pdf.writeToDisk(html,data.uid,function (filename) {

     let transporter = nodemailer.createTransport({
         service: self.service,
         auth: self.auth
     })

     let mailOptions = {
         from: 'stories360.org@gmail.com',
         to: data.toWhom,
         subject: 'stories360.org - Zugriffsdaten zu Deiner VR-Welt',
         text:'Im Anhang findest Du Deine Zugangsdaten. Du kannst damit Deine Welt jederzeit weiterbearbeiten, ansehen und teilen.',
         attachments: [{
          filename: 'stories360.org_'+data.uid+'.pdf',
          path: filename
        }]
     }

     // send mail with defined transport object
     transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
       return console.log(error);
      }
      cb()
     })
   })
  })
}


var mailer = null
if (!mailer) {
 mailer = new AMailer()
}

module.exports = mailer
