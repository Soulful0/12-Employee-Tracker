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

async function connect() {
  return await pool.connect();
}

// client.query("SELECT NOW()");
// client.release();

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

// Function to add a new employee
async function addEmployee() {
  try {
    answers = await inquirer.prompt([
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
    console.log("There was an error adding new employees");
  }

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

    client = await connect();

    // Running the query
    await client.query(sql, values);

    console.log("Employee added successfully:");
  } catch (err) {
    console.error("Error adding employee:", err);
  } finally {
    // Finally statement. Meaning that regardless, this will run.
    client.release();
    mainMenu();
  }
}

// Function to update an employee's role
async function updateEmployeeRole() {
  try {
    answers = await inquirer.prompt([
      { name: "employeeId", type: "number", message: "Enter the employee ID:" },
      { name: "newRoleId", type: "number", message: "Enter the new role ID:" },
    ]);
    console.log("Updating employee role...");
  } catch (error) {
    console.log("There was an error updating the employee role");
  }

  try {
    // SQL statement
    const sql = `UPDATE employees SET role_id = $1 WHERE id = $2`;

    // Taken from the user
    const values = [answers.newRoleId, answers.employeeId];

    client = await connect();

    // Running the query
    await client.query(sql, values);

    console.log("Employee role updated successfully:");
  } catch (err) {
    console.error("Error updating employee role:", err);
  } finally {
    // Finally statement. Meaning that regardless, this will run.
    client.release();
    mainMenu();
  }
}

// Function to add a new department
async function addDepartment() {
  try {
    answers = await inquirer.prompt([
      {
        name: "departmentName",
        type: "input",
        message: "Whats the name of the department?",
      },
    ]);
    console.log(`Added ${answer.departmentName} to the database.`);
  } catch (err) {
    console.log("There was an error adding the department");
  }

  try {
    // SQL statement
    const sql = `INSERT INTO departments (name) VALUES ($1)`;

    // Taken from the user
    const values = [answers.departmentName];

    client = await connect();

    // Running the query
    await client.query(sql, values);

    console.log("Department added successfully:");
  } catch (err) {
    console.error("Error adding department:", err);
  } finally {
    // Finally statement. Meaning that regardless, this will run.
    client.release();
    mainMenu();
  }
}

// Function to add a new role
async function addRole() {
  try {
    // Prompt user for role details
    const answers = await inquirer.prompt([
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
        name: "departmentId",
        type: "number",
        message: "Enter the department ID:",
      },
    ]);

    // SQL statement to insert a new role
    const sql = `INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)`;

    const values = [answers.title, answers.salary, answers.departmentId];

    client = await connect();

    await client.query(sql, values);
    console.log("Role added successfully.");
  } catch (err) {
    console.error("Error adding role:", err);
  } finally {
    client.release(); // Always release the client back to the pool
    mainMenu();
  }
}

// Function to view all employees
async function viewAllEmployees() {
  console.log("Fetching all employees...");

  client = await connect();

  client.query("SELECT * FROM employees", (err, res) => {
    if (err) {
      console.error("Error fetching employees.", err);
      client.release();
      return;
    }
    console.table(res.rows);
    client.release();
    mainMenu();
  });
}

// Function to view all roles
async function viewAllRoles() {
  console.log("Fetching all roles...");

  client = await connect();

  client.query("SELECT * FROM roles", (err, res) => {
    if (err) {
      console.error("Error fetching roles", err);
      client.release();
      return;
    }
    console.table(res.rows);
    client.release();
    mainMenu();
  });
}

// Function to view all departments
async function viewAllDepartments() {
  console.log("Fetching all departments...");

  client = await connect();

  client.query("SELECT * FROM departments", (err, res) => {
    if (err) {
      console.error("Error fetching departments.", err);
      client.release();
      return;
    }
    console.table(res.rows);
    client.release();
    mainMenu();
  });
}

// Function to handle quitting the application
async function quit() {
  console.log("Exiting application...");

  try {
    await pool.end();
    console.log("Database connections closed successfully.");
  } catch (err) {
    console.error("Failed to close database connection.", err);
  }

  // Ends connection to Node.js process
  process.exit();
}

pool.connect();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.listen(PORT, () => {
  console.log("Hey you did it!");
});

mainMenu();
