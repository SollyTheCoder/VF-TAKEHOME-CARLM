# Intro

This repo contains a small management portal that allows for CRUD operations on industries and their linked devices.

# Prerequisites

Before you begin, ensure you have the following:

1. Install Node.js - https://nodejs.org

2. Install Docker - https://docs.docker.com/get-docker/
and docker-compose cli tool

3. Clone the repository

# Deployment

There are 3 parts to the deployment of the application that should be deployed in this order

1. MySQL database running in a docker container

```
cd db
docker-compose up
```

You can view the SQL server (database - "business") at http://localhost:8080 with credentials
Username:_root_ Password:_example_

2. NodeJS api

```
cd api
npm i
npm run start
```
All api endpoints are by default under http://localhost:5001/{example}

3. React frontend

```
cd app
npm i
npm start
```
Frontend application by default is hosted at http://localhost:3000


You should now see the running application
