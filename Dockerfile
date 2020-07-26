FROM node:lts

RUN npm config set registry https://registry.npm.taobao.org && \
    npm config set sass_binary_site https://npm.taobao.org/mirrors/node-sass && \
    npm config set disturl https://npm.taobao.org/dist

RUN yarn config set registry https://registry.npm.taobao.org && \
    yarn config set sass_binary_site https://npm.taobao.org/mirrors/node-sass && \
    yarn config set disturl https://npm.taobao.org/dist

COPY . /code
WORKDIR /code

RUN yarn install && yarn cache clean

EXPOSE 8080
ENTRYPOINT [ "node", "/code/cli.js" ]