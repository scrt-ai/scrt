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

function main() {
  debug(`Watching directory ${WATCH_PATH}`);

  const watcher = chokidar.watch(WATCH_PATH, {
    ignored: /[\/\\]\./,
    persistent: true,
    ignoreInitial: true
  });

  watcher.on('change', path => {
    if (!path.endsWith('.jpg')) {
      return;
    }

    debug(`New image captured: ${path}`);

    // reading file
    const stream = fs.createReadStream(path);
    const buffers = [];
    stream.on('data', (data) => {
      buffers.push(data);
    });
    stream.on('end', () => {
      const buffer = Buffer.concat(buffers);

      // classifying image
      predictionClient.predict(buffer, (err, results) => {
        if (err) return handleError(err);

        debug('Results of image inference:', results);
      });
    });
  });
}

main();
