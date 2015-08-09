/**
 * Email Sender
 *
 */

//
// SETUP
//

//
// common modules
var http = require('http');
var fs = require('fs');
var path = require('path');

var colors = require('colors');
var info = console.info;

var config = require('./config.json');

//
// express
var express = require('express');
var app = express();
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.locals = require('./data.json');


//
// mailgun
var mailgun = require('mailgun-js');
var secret = require('./secret.json');

var api_key = secret.api;
var domain = secret.domain;
var from_who = secret.sender;
app.locals.email = secret.address;


//
// ROUTES
//

app.get('/', function(req, res) {
    res.render('index', function(err, html) {
        if (err) {
            info(err);
        } else {
            res.send(html);
        }
    });
});


//
// SERVER
//

var port = config.port + 999;
var server = app.listen(port, function(){
    info('App is running on port'.green + ' ' + colors.yellow(port));
});