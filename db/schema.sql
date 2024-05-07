DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees_db;

\c employees_db;

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department INTEGER,
  FOREIGN KEY (department) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE TABLE employee (

);