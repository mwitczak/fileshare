# Instashare

## Requirements
- docker-compose >= 1.25.3
- 

## Development environment
- run the docker-compose environment: `docker-compose up`
- in another window move to backend directory and execute `yarn && yarn db:migrate`
- frontend is available at `http://localhost:8081/`
- adminer (mysql management) is available at `http://localhost:8082/` - user: root password: example
- frontend tests (`requires docker-compose up`): `docker-compose exec frontend bash -c "yarn test`
- backend tests (`requires docker-compose up`): `docker-compose exec backend bash -c "yarn test`

## Technologies
- Node.js 10 LTS - backend
- React.js - frontend
- MySql - database
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
- improve responsiveness on the frontend
- write snapshots tests for components
- add flash messages for success, failure for every action
- move compression job to separate docker container so backend service is independent and can be scaled
- add more integration tests for API endpoints
- add more logging on the backend side



