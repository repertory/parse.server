FROM node:lts

RUN npm config set registry https://registry.npm.taobao.org && \
    npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass && \
    npm config set disturl https://npm.taobao.org/dist

RUN npm install -g @wang-dong/parse.server

COPY parse.json /code/parse.json
RUN sed -i -e 's~127.0.0.1:27017~mongo:27017~g' /code/parse.json

WORKDIR /code
EXPOSE 8080
ENTRYPOINT [ "parse.server" ]
