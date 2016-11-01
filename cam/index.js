/**
 * Camera shots classificator using TensorFlow Serving service.
 */

// env
if (!process.env.TENSORFLOW_SERVING_CONNECTION) {
  console.log('TENSORFLOW_SERVING_CONNECTION environment variable required.');
  process.exit(1);
}

const predictionClient = require('tensorflow-serving-node-client')(process.env.TENSORFLOW_SERVING_CONNECTION);
const debug = require('debug')('scrt:watcher');
const chokidar = require('chokidar');
const fs = require('fs');

const WATCH_PATH = './capture';

function handleError(err) {
  console.error(err);
}

function processImage(path, fn) {
  // reading file
  fs.readFile(path, (err, data) => {
    if (err) return fn(err);

    debug(`Classifying image of size ${data.length}`);

    // deleting file
    fs.unlink(path, () => {

      // classifying image
      predictionClient.predict(data, (err, results) => {
        if (err) return fn(err);

        debug('Image classification results:', results);
        fn(null, results[0][0]);
      });

    });

  });
}

function main() {
  console.log('Hi, show me something to the camera...');

  const watcher = chokidar.watch(WATCH_PATH, {
    ignored: /[\/\\]\./,
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('add', path => {
    if (!path.endsWith('.jpg')) {
      return;
    }

    debug(`New JPEG file: ${path}`);

    // processing image after some delay
    setTimeout(function () {
      processImage(path, (err, res) => {
        if (err) return handleError(err);

        console.log(`I see: ${res}`);
      });
    }, 500);

  });
}

main();
