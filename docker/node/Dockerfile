FROM node:16.13.0

ENV APP_ROOT /project

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD ./project ${APP_ROOT}

RUN cd app && npm install
RUN cd ./node-server && npm install
RUN cd ./app && npm run build
RUN cd ./app && npm run serve:node

ENV HOST 0.0.0.0
