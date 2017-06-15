#!/bin/env node

var express = require('express')
var app = express()
var cors = require('cors')
var favicon = require('serve-favicon')
var path = require('path')
var http = require('http').Server(app)
var io = module.exports = require('socket.io')(http)
var socket = require('./server/socket')(io)

var storage = require('./server/storage')

app.use(cors({origin:'http://stories360.org'}))

app.use(favicon(path.join(__dirname, 'favicon.ico')))
app.use(express.static(__dirname + '/client'))
app.use('/',require('./server/routes'))


// network
app.set('port', process.env.PORT || 3020)
app.set('ip', "127.0.0.1")

http.listen(app.get('port'),app.get('ip'), function () {
 console.log('listening on *:3020');
});
