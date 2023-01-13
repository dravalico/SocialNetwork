![Docker](https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D)

# SocialNewtork

This repository contains the final project for the "Web Programming" course held by Professor Andrea De Lorenzo @University of Trieste. The project consists in making a Twitter clone web app; the specs can be found [here](https://docs.google.com/document/d/1De075kDpVmQpv00WpYeGG9l4qgg834PunVHAbTsE_10/edit).

## Build with

Project is created with:

-   [Docker](https://www.docker.com/)
-   [Node.js](https://nodejs.org/en/)
-   [MongoDB](https://www.mongodb.com/)
-   [Vue.js](https://vuejs.org/)
-   [Vue CLI](https://cli.vuejs.org/)
-   [BootstrapVue](https://bootstrap-vue.org/)

# Before starting

Inside each of the `app` and `frontend` folders, there is an `.env` file. These files have been deliberately added to git to allow the application to work without further configuration and to facilitate the reading of the code, avoiding having to create new ones.

# Setup

Install all dependencies

```
npm install
```

Run docker command

```
docker compose up
```

This will create the necessary containers for the `MongoDB` database and for the `Node.js` server. If no changes have been made to the `Docker` related files and `.env` files, the application will be reachable at `http://localhost:3000`.

## Note about MongoDB

In the `.env` file inside the app `folder`, there is a variable, called `WITH_SAMPLE_DATA` which, when starting the database, checks if set equal to `true`. In this case, if the database is empty, it will read the files contained in the `app/db/mongo-seed` folder and try to insert them. If this data is not desired, just set the variable to `false` in the `.env` file.
