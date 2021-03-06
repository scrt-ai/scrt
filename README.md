# SCRT project
AI for security.


## How to run
First you need to install docker on your machine: [https://docs.docker.com/engine/installation/linux/ubuntulinux/](https://docs.docker.com/engine/installation/linux/ubuntulinux/)

To remove local docker image, e.g. scrtai/cam, type:
```
$ docker rmi scrtai/cam
```

### TensorFlow Serving server
Installing using docker:
```
$ docker run -d --name=inception -p 9000:9000 scrtai/inception /bin/bash -c "/serving/bazel-bin/tensorflow_serving/model_servers/tensorflow_model_server --port=9000 --model_name=inception --model_base_path=/serving/inception-export &> inception_log"
```


### HTTP API:
Installing using docker:
```
$ docker run -d --name=inception_api -p 8080:8080 --link=inception:tf -e DEBUG=scrt* scrtai/api
```

Post JPEG image to localhost:8080


### Camera real-time recognition:
Installing using docker:
```
$ docker run -d --name=inception_cam --link=inception:tf -e POST_SERVER=http://scrt.credo.ru/notify.php -e DEBUG=scrt* --device=/dev/video0:/dev/video0 scrtai/cam
```

Check container logs:
```
$ docker logs -f inception_cam
```
