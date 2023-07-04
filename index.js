require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose")

// Middleware imports
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require('cors');

const connection = mongoose.connection;
const app = express();

const port = process.env.PORT || 8000;

// connect mongodb using mongoose
mongoose.connect( process.env.DATABASE_URL,
{useNewUrlParser: true});

// check if connection to mongodb is successful
connection.once("open", ()=>{
  console.log("successfully connected to mongoDB")
})

// middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// routes
app.use('/auth', require('./routes/auth.js'));
app.use('/task', require('./routes/daydetails.js'));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});