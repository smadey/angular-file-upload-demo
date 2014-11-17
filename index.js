var fs = require('fs');
var http = require('http');
var path = require('path');

var bodyParser = require('body-parser');
var express = require('express');
var multipart = require('connect-multiparty');


var app = express();

app.set('port', 8099);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'app')));
app.use(multipart({ uploadDir: path.join(__dirname, 'app/upload') }));


// routes
app.get('/', function(req, res) {
    res.sendfile('app/index.html');
});

app.post('/services/upload', function(req, res) {
    var files = Array.isArray(req.files.file) ? req.files.file : req.files.file ? [req.files.file] : [];

    var paths = files.map(function(d) { return d.path; });

    setTimeout(function() {
        paths.forEach(function(path) {
            fs.exists(path, function(isExists) {
                if(isExists) {
                    fs.unlink(path, function() {
                        console.log('Remove file "' + path + '" successfully!');
                    });
                }
            });
        })
    }, 10000);

    res.send(paths);
});

module.exports = app;
