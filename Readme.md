# Instashare

## Requirements
- docker-compose >= 1.25.3
- node >= 10 LTS
- yarn 

## Development environment
- run the docker-compose environment: `docker-compose up`
- run database migrations in different window  
`cd backend`  
`yarn`  
`yarn db:migrate`
- frontend is available at `http://localhost:8081/`
- adminer (mysql management) is available at `http://localhost:8082/` - user: root password: example
- frontend tests (requires docker-compose up): `docker-compose exec frontend bash -c "yarn test"`
- backend tests (requires docker-compose up): `docker-compose exec backend bash -c "yarn test"`

## Technologies
- Node.js 10 LTS - backend
- React.js - frontend
- MySQL - database
- Docker - container

## What is implemented:
- register user
- login user
- change user name (not login)
- list user files
- upload file
- delete file
- change file description
- compression job runs every 1 minute to zip files in the database
- list files for all users

## What would be next steps:
- add file/redis caching on the backend for files retrieved from the database
- improve responsiveness on the frontend
- write snapshots tests for components
- add flash messages for success, failure for every action
- move compression job to separate docker container so backend service is independent and can be scaled
- add more integration tests for API endpoints
- add more logging on the backend side
- move db query logic from backend main.js to service/model
- improve handling of big files - currently it fails because of max_allowed_packets error

## Author
Martin Witczak  
witczak.martin@gmail.com