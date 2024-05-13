INSERT INTO departments (name, departments_id) VALUES
('Engineering', 1),
('Finance', 2),
('Legal', 3),
('Sales', 4);

INSERT INTO roles (title, salary, department_id) VALUES
('Legal', 65000, 3)
('Engineering', 85000, 1)


INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, 1),
('Billy', 'Bob', 2, null)
('Keanu', 'Reeves', 3, null)

