# SCRT project
AI for security.


## How to run
First you need to install docker on your machine: [https://docs.docker.com/engine/installation/linux/ubuntulinux/](https://docs.docker.com/engine/installation/linux/ubuntulinux/)


### TensorFlow Serving server
Installing using docker:
```
$ docker run -d --name=inception -p 9000:9000 scrtai/inception /bin/bash -c "/serving/bazel-bin/tensorflow_serving/model_servers/tensorflow_model_server --port=9000 --model_name=inception --model_base_path=/serving/inception-export &> inception_log"
```


### HTTP API:
Installing using docker:
```
$ docker run -d --name=inception_api -p 8080:8080 -e TENSORFLOW_SERVING_CONNECTION=localhost:9000 scrtai/api:api-latest
```

Post JPEG image to localhost:8080


### Camera real-time recognition:

Install Node:
```
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

Clone repository:
```
$ git clone https://github.com/scrt-ai/scrt
$ cd scrt/cam
$ sudo npm i
```

Install fswebcam:
```
$ sudo apt-get update
$ sudo apt-get install fswebcam
```

Assuming that camera device is /dev/video0, run:
```
$ mkdir capture
$ bash capture.sh
$ node index.js
```

To stop video capturing type:
```
$ killall fswebcam
```
