-- seeds.sql
--Connect to the Database
\c employees_db

-- Insert initial department
INSERT INTO department (name) VALUES
('Sales'),
('Engineering'),
('Human Resources'),
('Marketing');

-- Insert initial role
INSERT INTO role (title, salary, department_id) VALUES
('Sales Manager', 80000, 1),
('Sales Associate', 50000, 1),
('Software Engineer', 90000, 2),
('Data Scientist', 95000, 2),
('HR Manager', 70000, 3),
('Recruiter', 60000, 3),
('Marketing Manager', 75000, 4),
('Content Writer', 55000, 4);

-- Insert initial employee
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Alice', 'Johnson', 3, NULL),
('Bob', 'Brown', 4, 3),
('Charlie', 'Davis', 5, NULL),
('Eve', 'Wilson', 6, 5),
('Frank', 'Miller', 7, NULL),
('Gamal', 'Mubarak', 8, 7);
