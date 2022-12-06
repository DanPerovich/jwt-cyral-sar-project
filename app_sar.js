require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Client } = require('pg');
const client = new Client();

const User = require("./model/user");
const auth = require("./middleware/auth");

const app = express();

client.connect();

app.use(express.json({ limit: "50mb" }));

app.post("/register", async (req, res) => {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
    // save user token
    user.token = token;

    // return new user
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  try {
    // Get user input
    const { email, password, secret } = req.body;

    // Validate user input
    if (!(email && password && secret)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email, secret },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );

      // save user token
      user.token = token;

      // user
      res.status(200).json(user);
    } else {
      res.status(400).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);  }
});

app.get("/welcome", auth, (req, res) => {
  // -------------------------------------------------------
  // Original code snippet for constructing database query  |
  // -------------------------------------------------------
  let limit = req.query.limit;
  let currentUser = req.user.email;
  selectQuery = `SELECT * FROM transactions LIMIT ${limit ? limit : 1};`;
  
  // --------------------------
  // ADDED Cyral code snippet  |
  // --------------------------
  selectQuery = `/* CyralContext {"user":"${currentUser}","userGroup":"Finance","serviceName":"NodeJWTwPostgresSAR"} */ ${selectQuery}`;
   
  // ---------------------------------------------------------------------------
  // Original code snippet to execute query, build response, and send response  |
  // ---------------------------------------------------------------------------
  responseBlob = "Welcome " + currentUser + " 🙌";
  client.query(selectQuery, (err, res2) => {
    if (err) {
      res.status(500).send('Server-side error\n\n' + err.stack);
    } else {
      responseBlob += `\n\nQuery:\n${selectQuery}\n\nResult (rows: ${res2.rowCount}):\n${JSON.stringify(res2.rows,null,4)}`;
      res.status(200).send(responseBlob);
    }
  });
});

// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

module.exports = app;
