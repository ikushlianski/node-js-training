# EPAM Node.js training

## Homework 1
### Task 1.1
A program which reads a string from the standard input stdin, reverses it and then writes it to the standard output stdout

Run `npm run task-1.1` to launch.
Run `npm run task-1.1:babel` to launch the same program using babel compiler.

### Task 1.2
A program which reads the content of `csv` file from `./csv` directory into `txt` directory.

Run `npm run task-1.2` to launch.
Run `npm run task-1.2:babel` to launch the same program using babel compiler.
Run `npm run task-1.2-streams` to launch the same program and it will use streams to read the file.

## Homework 2 - CRUD API
### Tasks 2.1 and 2.2
A simple REST service with `CRUD` operations for `User` entity.

Run `npm start` to launch.


#### Endpoints
Create user: POST `/api/users`

Update user: PATCH `/api/users/:userId`

Get autosuggest list of users: GET `/api/users/suggest?limit=3&username=rob` (query param `username` is required)

Delete user: `/api/users/:userId`

#### Validation rules
- password must contain letters and numbers;
- user’s age must be between 4 and 130
- login, password and age are required when creating a user
- user id cannot be changed

## Homework 3 - ORM
### Tasks 3.1 and 3.2

#### Database configuration
Required environment variables are located in `.env.example` file.

#### Populate DB with users
Run `npm run users:seed` to populate the database with initial user data.

Run `npm start` to launch the application.

## Homework 4 - Many to Many relations
#### Database configuration
Environment variables are in `.env.example` file. Set up your own `.env` file accordingly.
Upon launch Sequelize will sync all tables in DB.

Run `npm start` to launch the application.

#### Endpoints
Create group: POST `/api/groups`
```json
{
	"name": "admins",
	"permissions": ["READ", "SHARE", "WRITE"]
}
```
Get all groups: GET `/api/groups`

Get group by id: GET `/api/groups/:groupId`

Update group: PATCH `/api/groups/:groupId`
```json
{
	"name": "admins",
	"permissions": []
}
```

Delete group: DELETE `/api/groups/:groupId`

Add users to group: POST `/api/groups/add-users`
```json
{
	"groupId": "06b92047-d584-4c1f-9bb8-7987736829f2",
	"userIds": ["1b94587f-129b-4964-b64c-93e7ca41bfd7", "2cd89c78-337d-41b1-9f5c-41d5d8fefebe"]
}
```
