# transfer-fund-api
API to transfer balance from a account to another

[![Made with Node.js](https://img.shields.io/badge/Node.js->=12-green?logo=node.js)](https://nodejs.org "Go to Node.js homepage")
[![Made with TypeScript](https://img.shields.io/badge/TypeScript-4-blue?logo=typescript)](https://typescriptlang.org "Go to TypeScript homepage")
[![Made with MongoDB](https://img.shields.io/badge/MongoDB-3-green?logo=mongodb)](https://www.mongodb.com/ "Go to MongoDB homepage")
[![Made with RabbitMQ](https://img.shields.io/badge/RabbitMQ-3-orange?logo=rabbitmq)](https://www.rabbitmq.com/ "Go to RabbitMQ homepage")
[![Made with Docker](https://img.shields.io/badge/Made_with-Docker-blue?logo=docker)](https://www.docker.com/ "Go to Docker homepage")


[![Docker - image](https://img.shields.io/badge/Docker-image-blue?logo=docker)](https://github.com/davidRosini/transfer-fund-api/blob/main/Dockerfile)
[![Docker - compose](https://img.shields.io/badge/Docker-compose-blue?logo=docker)](https://github.com/davidRosini/transfer-fund-api/blob/main/docker-compose.yml)
[![Postman - collection](https://img.shields.io/badge/Postman-collection-orange?logo=postman)](https://github.com/davidRosini/transfer-fund-api/tree/main/postman)

### Packages
[![dependency - express](https://img.shields.io/badge/dependency-express-green?logo=node.js)](https://www.npmjs.com/package/express)
[![dependency - mongoose](https://img.shields.io/badge/dependency-mongoose-green?logo=node.js)](https://www.npmjs.com/package/mongoose)
[![dependency - amqplib](https://img.shields.io/badge/dependency-amqplib-orange?logo=node.js)](https://www.npmjs.com/package/amqplib)
[![dependency - axios](https://img.shields.io/badge/dependency-axios-orange?logo=node.js)](https://www.npmjs.com/package/axios)

## Table of Contents

  - [Setup](#setup)
  - [Run application](#run-application)
  - [Docker image](#docker-image)
  - [API flow chart](#api-flow-chart)
 
## Setup

Run docker-compose command in the terminal to start the local dependencies (require [docker](https://docs.docker.com/get-docker/) instaled)
```
$ docker-compose up -d
```

Install node dependencies with (require [nodejs](https://nodejs.org/en/download/) installed)
```
$ npm install
```

## Run application

Run server with command
```
$ npm run start
```

if need to debug the application use command
```
$ npm run debug
```

## Docker image

Setup .env file with the path to the applications dependencies

Build the image
```
$ docker build . -t <your name>/transfer-fund-api
```

Run the application
```
$ docker run -p 3000:3000 -d <your name>/transfer-fund-api
```

## API flow chart

<div align="center">
    <img src="./images/api-transfer-bankly-2022-08-09-1753.svg" alt="flow chart" title="API flow chart"/>
</div>
