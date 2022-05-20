# Javier Garcia-Navarro House of Games API

## Summary 

The project is about building an API for the purpose of accessing application data programmatically. The intention is to mimic the building of a real world backend service which should provide this information to the front end architecture.

## Hosted version here

https://ncgames-javiergarcia.herokuapp.com/api

## Instructions

Clone this repository in your terminal. You will need your credentials in order to do this.

```
$ git clone https://github.com/JavierGarna/Be-NC-Games.git
```

Install all the relevant packages. You will additionally need to install *express* and *supertest*.

```
npm install
```

```
npm install express
```

```
npm install supertest
```

You will need to create two .env files: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names). **Double check that these .env files are .gitignored.**

Seed the local database with the following commands

```
npm run setup-dbs
```

```
npm run seed
```

You can run the test by using the following command

```
npm test
```

## Requirements

These are the **minimum versions** of Node.js and Postgres needed to run the project.

- Node.js: **v12.22.11**
- Postgres: **14.2**


