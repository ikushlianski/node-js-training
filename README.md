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

## CRUD API (Task 2)
### Tasks 2.1 and 2.2
A simple REST service with `CRUD` operations for `User` entity.

Run `npm run start` to launch.

Create user: POST `/api/users`
Update user: PATCH `/api/users/:userId`
Get autosuggest list of users: GET `/api/users/suggest?limit=3&username=rob` (query param `username` is required)
Delete user: `/api/users/:userId`

### Validation rules
- password must contain letters and numbers;
- user’s age must be between 4 and 130
- login, password and age are required when creating a user
- user id cannot be changed
