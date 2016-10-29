
var PROTO_PATH = __dirname + '/protos/prediction_service.proto';

var grpc = require('grpc');
var tensorflow_serving = grpc.load(PROTO_PATH).tensorflow.serving;

module.exports = (connection) => {
  
  var client = new tensorflow_serving.PredictionService(
    connection, grpc.credentials.createInsecure()
  );

  return {

    /**
     * Calls predict gRPC method on TensorFlow Serving server.
     *
     * @param      {Function}  fn      Callback.
     */
    predict: (fn) => {
      var msg = {
        model_spec: { name: 'inception' },
        inputs: {
          images: null
        }
      };

      client.predict(msg, (err, response) => {
        if (err) return fn(err);

        fn(null, response.message)
      });
    }
  }
};
