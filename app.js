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

var config = require('./config');

//
// express
var express = require('express');
var app = express();
app.use(express.static(__dirname));
app.set('view engine', 'ejs');
app.locals = require('./data.json');


//
// mailgun
var Mailgun = require('mailgun-js');
var secret = require('./secret.json');

var api_key = secret.api;
var domain = secret.domain;
var from_who = secret.sender;

app.locals.from = from_who;
app.locals.subject = secret.subject;
app.locals.email = secret.address;


//
// ROUTES
//

// show form
app.get('/', function(req, res) {
    res.render('index', function(err, html) {
        if (err) {
            info(err);
        } else {
            res.send(html);
        }
    });
});

// send mail
app.get('/submit', function(req,res){
    var fp = path.join(__dirname, './build/image-data.html');
    var mailgun = new Mailgun({apiKey: api_key, domain: domain});

    // get html
    fs.readFile(fp, 'utf8', function (err, text) {
        if (err) {
            return console.log(err);
        }

        var data = {
            from: req.query.from,
            to: req.query.mail,
            subject: req.query.subject,
            html: text
        };

        // send as message
        mailgun.messages().send(data, function (error, body) {
            if (error) {
                res.render('error', {error: error});
            }
            else {
                console.log("Mail sent!");

                // get back to form
                setTimeout(function(){
                    res.redirect("/");
                }, 1000);
            }
        });
    });
});


//
// SERVER
//

var port = config.port + 999;
var server = app.listen(port, function(){
    info('App is running on port'.green + ' ' + colors.yellow(port));
});
