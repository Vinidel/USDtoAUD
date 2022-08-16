FROM node:16.14.0-alpine3.15

RUN mkdir -p /app && npm config set strict-ssl false
RUN apk add --no-cache make gcc g++ python && \
  export NODE_TLS_REJECT_UNAUTHORIZED=0
COPY ["package-lock.json", "package.json", "/app/"]

RUN rm -rf /app/dist
RUN mkdir -p /app/dist
COPY . ./app
WORKDIR /app

RUN npm install --quiet && \
  apk del --purge make gcc g++ python && \
  rm -rf /root/.npm /tmp/* /var/cache/apk/* /root/.node_gyp

EXPOSE 8080
CMD ["npm", "start"]