# jwt-cyral-sar-project
A simple NodeJS app demonstrating JWT WebApp authorization coupled with Cyral Service Account Resolution using query annotation.


## Installation / Setup
1. Create an .env file before running the application.  Use the .env.example file as a template.
2. Run `npm install`
3. Run one of the following:
        `npm run original`
        `npm run sar`
        `npm run sarV2`
4. Import the Postman collection and environment files from the `JWT-PROJECT/postman` folder
5. Optional: use the register `POST` to create a new username/password combination in the Mongo database you have configured in your `.env` file.  These users are persisted in the MongoDB, so no need execute this step upon every restart of the webapp
6. Use the login `POST` to generate a JWT token
7. Save the token from the response in step 6 to the `{{currentJwtToken}}` Postman variable
8. Send the welcome `GET` (optionally sending the limit querystring paramter)

**Note**: Please see the Cyral documentation (https://docs.cyral.com) for Cyral Control Plane-side configuration details to enable Custom Application Service Account Resolution for PostgreSQL.


## Features per Environment:
- `original` - Sends the SELECT query to the PostgreSQL database you have configured in your `.evn` file.  Optionally, you can send a "limit" querystring parameter with an integer to control the literal used in the SQL `LIMIT` contraint.  If the querystring is not specified, it is defaulted to a value of 1
- `sar` - demonstrates how the user email from the JWT can be passed to Cyral using a `CyralContext` query comment
- `sarV2` - builts upon the "sar" version to demonstrated passing arbitrary key value pairs within the `CyralContext`. The policies_samples/additionalChecksForCyralContext.yaml file contains an example of how the arbitrary key value pairs can be targeted