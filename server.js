const express = require("express");
const inquirer = require("inquirer");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: "",
  password: "",
  network: "localhost",
  database: "",
});

inquirer.prompt([
  {
    type: "list",
    message: "What would you like to do?",
    choices: [],
    name: "action",
  },
]);

pool.connect();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("Hey you did it!");
});
