
const fs = require('fs');
const predictionClient = require('./')('192.168.99.100:9000');

const IMAGE_PATH = './cat.jpg';
const imageStream = fs.createReadStream(IMAGE_PATH);

predictionClient.predict(imageStream, (err, res) => {
  if (err) {
    return console.error(err);
  }

  console.log('Response:', res);
});
