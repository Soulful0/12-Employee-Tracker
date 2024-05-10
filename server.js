const express = require("express");
const inquirer = require("inquirer");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3001;

const pool = new Pool({
  user: "postgres",
  password: "may62004",
  network: "localhost",
  database: "employees_db",
});

pool.connect((err, result) => {
  if (err) {
    return console.error("Error connecting to client");
  }
  console.log("Successful connection made");
});

const client = await pool.connect();

await client.query("SELECT NOW()");
client.release();

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
        name: "action",
      },
    ])
    .then((res) => {
      switch (res.action) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View All Roles":
          viewAllRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewAllDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          quit();
          break;
        default:
          console.log("Invalid option");
          mainMenu(); // Calls mainMenu to handle an invalid option
          break;
      }
    });
}

// Function to view all employees
function viewAllEmployees() {
  console.log("Fetching all employees...");
}

// Function to add a new employee
async function addEmployee() {
  try {
    inquirer.prompt([
      { name: "firstName", type: "input", message: "Enter the first name:" },
      { name: "lastName", type: "input", message: "Enter the last name:" },
      { name: "roleId", type: "number", message: "Enter the role ID:" },
      {
        name: "managerId",
        type: "number",
        message: "Enter the manager ID (optional):",
      },
    ]);

    console.log("Adding new employee...");
  } catch (error) {
    res
      .status(400)
      .json({ message: "There was an error adding new employees" });
  }

  // Connect to the database
  const client = await pool.connect();

  try {
    // SQL statement
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;

    // Taken from the user
    const values = [
      answers.firstName,
      answers.lastName,
      answers.roleId,
      answers.managerId || null,
    ];

    // Running the query
    await client.query(sql, values);

    res.status(200).json({ message: "Employee added successfully:" });
  } catch (err) {
    console.error("Error adding employee:", err);
  } finally {
    // Finally statement. Meaning that regardless, this will run.
    client.release();
  }
}

// Function to update an employee's role
async function updateEmployeeRole() {
  try {
    inquirer.prompt([
      { name: "employeeId", type: "number", message: "Enter the employee ID:" },
      { name: "newRoleId", type: "number", message: "Enter the new role ID:" },
    ]);
    console.log("Updating employee role...");
  } catch (error) {
    res
      .status(400)
      .json({ message: "There was an error updating the employee role" });
  }

  // Connect to the database
  const client = await pool.connect();

  try {
    // SQL statement
    const sql = `UPDATE employees SET role_id = $1 WHERE id = $2`;

    // Taken from the user
    const values = [answers.newRoleId, answers.employeeId];

    // Running the query
    await client.query(sql, values);

    res.status(200).json({ message: "Employee role updated successfully:" });
  } catch (err) {
    console.error("Error updating employee role:", err);
  } finally {
    // Finally statement. Meaning that regardless, this will run.
    client.release();
  }
}

// Function to add a new department
async function addDepartment() {
  try {
    inquirer.prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Whats the name of the department?",
      },
    ]);
    console.log(`Added ${answer.departmentName} to the database.`);
  } catch (error) {
    res
      .status(400)
      .json({ message: "There was an error adding the department" });
  }

  // Connect to the database
  const client = await pool.connect();

  try {
    // SQL statement
    const sql = `INSERT INTO departments (name) VALUES $1`;

    // Taken from the user
    const values = [answers.departmentName];

    // Running the query
    await client.query(sql, values);

    res.status(200).json({ message: "Department added successfully:" });
  } catch (err) {
    console.error("Error adding department:", err);
  } finally {
    // Finally statement. Meaning that regardless, this will run.
    client.release();
  }
}

// Function to add a new role
function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the name of this role?",
      },
      {
        name: "salary",
        type: "number",
        message: "What is the salary of the role?",
      },
      {
        // select adddepartment answer
      },
    ])
    .then((answers) => {
      console.log("Adding new role...");
    });
}

// Function to view all roles
function viewAllRoles() {
  console.log("Fetching all roles...");
}

// Function to view all departments
function viewAllDepartments() {
  console.log("Fetching all departments...");
}

// Function to handle quitting the application
function quit() {
  console.log("Exiting application...");
}

pool.connect();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("Hey you did it!");
});

mainMenu();
