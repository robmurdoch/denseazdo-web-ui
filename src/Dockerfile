FROM node:13-alpine

RUN npm config set strict-ssl false \
    && npm config set proxy http://proxy.xxxxxx.com:8080

RUN mkdir -p /home/app

COPY ./dist/web-ui /home/app

# install packages
# RUN npm ci
RUN npm install -g @angular/cli

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# will execute npm install in /home/app because of WORKDIR
# RUN npm install

CMD ng serve --host 0.0.0.0 --port 4200
