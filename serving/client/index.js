
const PROTO_PATH = __dirname + '/protos/prediction_service.proto';

const grpc = require('grpc');

module.exports = (connection) => {
  
  var tensorflow_serving = grpc.load(PROTO_PATH).tensorflow.serving;
  var client = new tensorflow_serving.PredictionService(
    connection, grpc.credentials.createInsecure()
  );

  return {

    /**
     * Calls predict gRPC method on TensorFlow Serving server.
     *
     * @param      {ReadStream}  stream  JPEG read stream for classification.
     * @param      {Function}    fn      Callback.
     */
    predict: (stream, fn) => {

      // reading stream
      var buffers = [];
      stream.on('data', (buffer) => {
        buffers.push(buffer);
      });
      stream.on('end', () => {
        var buffer = Buffer.concat(buffers);

        // building PredictRequest proto message
        const msg = {
          model_spec: { name: 'inception' },
          inputs: {
            images: {
              dtype: "DT_STRING",
              tensor_shape: {
                dim: {
                  size: 1
                }
              },
              string_val: buffer
            }
          }
        };

        // calling gRPC method
        client.predict(msg, (err, response) => {
          if (err) return fn(err);

          // decoding response
          const classesBufs = response.outputs.classes.string_val;
          const classes = classesBufs.map((b) => b.toString('utf8'));

          fn(null, classes)
        });
      });
      
    }
  }
};
