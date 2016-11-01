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

function processImage(path) {
  // reading file
  fs.readFile(path, (err, data) => {
    if (err) return handleError(err);

    debug(`Classifying image of size ${data.length}`);

    // deleting file
    fs.unlink(path, () => {

      // classifying image
      predictionClient.predict(data, (err, results) => {
        if (err) return handleError(err);

        debug('Image classification results:', results);
        console.log(`I see ${results[0]}`)
      });

    });

  });
}

function main() {
  debug(`Watching directory ${WATCH_PATH}`);

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

    // processing image after 1 sec
    setTimeout(function () {
      processImage(path);
    }, 1000);

  });
}

main();
