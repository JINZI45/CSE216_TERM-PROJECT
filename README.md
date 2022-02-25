### Download

Download zip of this repository, or clone this from git cli

### Dependencies

The project runs on NodeJS environment. So at first you should download node in your machine.

## Installing

After cloning create a database user with the following permission
- create session.
- create sequence.
- create trigger.
- create table.
- create procedure
- unlimited tablespace.

Or, Run the following code in cmd after connecting as sysdba.

```
define username = <USERNAME>
define password = <PASSWORD>
create user &username identified by &password;
grant create session, create view,
 create sequence,
 create procedure,
 create table,
 create trigger,
 create type,
 create materialized view
 to &username;
```

run the scripts

Running the scripts:

```
npm install
```

## Configure

The environment variables and other sensitive info like password are kept in an env file.
Create a `.env` file in the root folder.
Add the following variables in it

```dotenv
PORT=4000
```

## Executing program

Run the script
```
npm start
```
to start node monitor realtime updater for node environment.
```
npm run dev
```
To kill process type ctrl+c `^C` in terminal