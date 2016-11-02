FROM node:5-onbuild
MAINTAINER Alex Melnikov <alexey.ernest@gmail.com>

# install fswebcam
RUN apt-get update && apt-get install -y \
  fswebcam

# create dir for capturing
RUN mkdir capture

# CMD
CMD ["sh", "-c", "fswebcam -c fswebcam.conf ; npm start"]

EXPOSE 8080
