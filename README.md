# SCRT project
AI for security.


## How to run

Start tensorflow serving:
```
docker run -d --name=inception -p 9000:9000 scrtai/inception /bin/bash -c "/serving/bazel-bin/tensorflow_serving/model_servers/tensorflow_model_server --port=9000 --model_name=inception --model_base_path=/serving/inception-export &> inception_log"
```

Start HTTP API (--server param should have ip of the first container):
```
docker run -d --name=inception_api -p 8080:8080 -e SCRIPT_COMMAND='/serving/bazel-bin/tensorflow_serving/example/inception_client --server=192.168.99.100:9000 --image=$image' -e DEBUG=scrt* scrtai/inception /bin/bash -c "nodejs /nn/tensorflow/serving/api/index"
```

Post JPEG image to <host>:8080