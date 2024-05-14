\c employees_db;

INSERT INTO departments (name) VALUES
('Engineering'),
('Finance'),
('Legal'),
('Sales');

INSERT INTO roles (title, salary, department_id) VALUES
('Legal', 65000, 3),
('Engineering', 85000, 1);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, 1),
('Billy', 'Bob', 2, null),
('Keanu', 'Reeves', 3, null);

