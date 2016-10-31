/**
 * HTTP API for TensorFlow Serving server.
 */

// env
if (!process.env.TENSORFLOW_SERVING_CONNECTION) {
  console.log('TENSORFLOW_SERVING_CONNECTION environment variable required.');
  process.exit(1);
}

const http = require('http');
const Busboy = require('busboy');
const predictionClient = require('tensorflow-serving-node-client')(process.env.TENSORFLOW_SERVING_CONNECTION);
const debug = require('debug')('scrt');

const handleError = (err, res) => {
  res.statusCode = 500;
  res.end('Internal Server Error:' + err);
}

const server = http.createServer((req, res) => {

  if (req.method === 'GET') {
    // showing form
    var html = `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <title>SCRT</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <form action="/" method="post" enctype="multipart/form-data">
          <label for="image">Select image for classification</label>
          <input id="image" name="image" type="file" accept="image/jpeg" />
          <button type="submit">Upload</button>
        </form>
      </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.end(html);
  } else if (req.method !== 'POST') {
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
