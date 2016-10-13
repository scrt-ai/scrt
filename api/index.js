var http = require('http');
var fs = require('fs');
var tmp = require('tmp');
var debug = require('debug')('scrt');
var exec = require('child_process').exec;
var Busboy = require('busboy');

var SCRIPT_COMMAND = process.env.SCRIPT_COMMAND || '';

function execScript(cmd, cb) {
  exec(cmd, function (err, stdout, stderr) {
    if (err) return cb(err);
    cb(null, stdout);
  });
}

function handleError(err, res) {
  res.statusCode = 500;
  res.end('Internal Server Error:' + err);
}

var server = http.createServer(function (req, res) {
  // todo: check if the method is POST and type is multipart-data
  if (req.method !== 'POST') {
    res.statusCode = 404;
    return res.end();
  }

  var files = [];

  var busboy = new Busboy({ headers: req.headers });
  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    if (mimetype !== 'image/jpeg') {
      res.statusCode = 415;
      file.resume();
      return;
    }

    // create temp file
    tmp.file(function(err, path) {
      if (err) {
        handleError(err, res);
        file.resume();
      }

      files.push(path);

      // upload file
      debug('Uploading file ' + filename + ' to ' + path);
      file.pipe(fs.createWriteStream(path));
    });
  });
  busboy.on('finish', function() {
    if (files.length === 0) {
      res.statusCode = 400;
      return res.end('0 JPEGs were uploaded.');
    }

    var path = files[0];
    var cmd = SCRIPT_COMMAND.replace('$image', path);
    debug('Executing script: ' + cmd);
    execScript(cmd, function (err, stdout) {
      if (err) return handleError(err, res);

      debug('Result of script execution: ' + stdout);
      res.end(stdout);
    });
  });
  return req.pipe(busboy);
});

server.listen(8080, function () {
  debug('Listening on port 8080');
});
