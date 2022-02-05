# FROM node:13-alpine

FROM nginx:alpine

RUN mkdir -p /home/app

COPY ./dist/web-ui /home/app
ADD ./ExperimentRootCA.crt /usr/local/share/ca-certificates/experimentrootca.crt
ADD ./certificate.crt /etc/ssl/nginx.crt
ADD ./private.key /etc/ssl/nginx.key

COPY ./src/nginx.conf /etc/nginx/conf.d/default.conf


# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app
