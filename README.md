# SCRT project
AI for security.


Start tensorflow serving:
```
docker run -d --name=inception -p 9000:9000 scrtai/inception /bin/bash -c "/serving/bazel-bin/tensorflow_serving/model_servers/tensorflow_model_server --port=9000 --model_name=inception --model_base_path=/serving/inception-export &> inception_log"
```

Start HTTP API:
```
docker run -d --name=inception_api -p 8080:8080 -e SCRIPT_COMMAND='/serving/bazel-bin/tensorflow_serving/example/inception_client --server=192.168.99.100:9000 -e DEBUG=scrt* --image=$image' scrtai/inception /bin/bash -c "nodejs /nn/tensorflow/serving/api/index"
```