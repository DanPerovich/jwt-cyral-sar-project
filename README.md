# jwt-project
A simple NodeJS app demonstrating JWT WebApp authorization coupled with Cyral Service Account Resolution using query annotation.


Installation / Setup
1) Create an .env file before running the application.  Use the .envSample file as a template.
2) Run  npm install
3) Run one of the following:
        npm run original
        npm run sar
        npm run sarV2
4) Import the postman collection and environment files from the JWT-PROJECT/postman folder
5) Optional: use the register POST to create a new username/password combination in the Mongo database
6) Use the login POST to generate a JWT token
7) Save the token from the response in step 6 to the {{currentJwtToken}} postman variable
8) Send the welcome GET (optionally sending the limit querystring paramter)
