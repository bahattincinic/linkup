FROM stackbrew/ubuntu:precise

RUN echo "deb http://archive.ubuntu.com/ubuntu precise main universe" > /etc/apt/sources.list
RUN echo "deb http://ppa.launchpad.net/chris-lea/node.js/ubuntu precise main" >> /etc/apt/sources.list
RUN apt-get update

# Faster to add GPG key directly, rather than install python-software-properties
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys C7917B12

RUN apt-get update
RUN apt-get install -y nodejs
RUN npm install -g forever

ADD bundle /app
# install depended npm modules for meteor project
WORKDIR /app/programs/server/
RUN npm install
# these env vars needed for app to run
ENV PORT 3000
ENV MONGO_URL mongodb://db:27017/linkup
ENV ROOT_URL http://linkup.com
ENV AMQP_HOST amqp
# expose needed ports
EXPOSE 3000
# reset workdir to /
WORKDIR /

CMD forever /app/main.js
