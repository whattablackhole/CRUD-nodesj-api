# App instalation:

1. cd to path where package.json located.
2. run npm install.


# App scripts:

1. npm run start:dev         -- running app in dev mode with hot reloading
2. npm run start:prod        -- building and running app in prod mode using dist file located in dist/server.js
3. npm run start:multi       -- running clustered application using /src/multi/index.ts script
4. npm run test              -- running app tests silently
5. npm run test:verbose      -- runnings app tests with app logs

## By default, app running on http://localhost:4000 address. You can change the port in .env file

# Api description:

1. Endpoint `api/users`:
    - **GET** `api/users` is used to get all persons
        - Server should answer with `status code` **200** and all users records
    - **GET** `api/users/{userId}` 
        - Server should answer with `status code` **200** and record with `id === userId` if it exists
        - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **POST** `api/users` is used to create record about new user and store it in database
        - Server should answer with `status code` **201** and newly created record
        - Server should answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
    - **PUT** `api/users/{userId}` is used to update existing user
        - Server should answer with` status code` **200** and updated record
        - Server should answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server should answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
    - **DELETE** `api/users/{userId}` is used to delete existing user from database
        - Server should answer with `status code` **204** if the record is found and deleted
        - Server should answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
        - Server should answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist

# App structure:

1. src/index.ts is entry point for setting up and starting  the application
2. src/app.ts is entry point for api server. It handles registration of routers, handles app errors and requests/responses.
3. src/controllers - user controllers for handle business logic
4. src/routers - for routing requests to correct controllers
5. src/decorators - contains http function decorators for easing the controllers setup
6. src/schemas and scr/models and src/validators are used to validate, parse request body and provide interfaces for business logic.
7. src/test - where all tests located.
8. src/http - some helpers a.k.a. http response interface
9. src/database - contains in memory db and db client to provide storage for data.
10. src/errors - contains app error interfaces.
