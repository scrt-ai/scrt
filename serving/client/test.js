
var client = require('./')('192.168.99.100:9000');

client.predict((err, res) => {
  console.log('Response:', res);
});