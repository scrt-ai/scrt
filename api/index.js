
const http = require('http');
const Busboy = require('busboy');
const debug = require('debug')('scrt');
const predictionClient = require('../serving/client')('192.168.99.100:9000');

const handleError = (err, res) => {
  res.statusCode = 500;
  res.end('Internal Server Error:' + err);
}

const server = http.createServer((req, res) => {

  if (req.method !== 'POST') {
    res.statusCode = 404;
    return res.end();
  }

  var files = [];

  var busboy = new Busboy({ headers: req.headers });  
  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    
    if (mimetype !== 'image/jpeg') {
      res.statusCode = 415;
      return file.resume();
    }

    var buffers = [];
    file.on('data', (data) => {
      buffers.push(data);
    });
    file.on('end', () => {
      files.push(Buffer.concat(buffers));
    });

  });
  busboy.on('finish', () => {
    
    if (files.length === 0) {
      res.statusCode = 400;
      return res.end('No JPEGs were uploaded.');
    }

    predictionClient.predict(files, (err, results) => {
      if (err) return handleError(err, res);

      debug('Results of image inference:', results);

      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(results));
    });    
  });

  return req.pipe(busboy);
});

server.listen(8080, function () {
  debug('Listening on port 8080');
});
