
import { pool } from './connection.js';
import inquirer from 'inquirer';

// Function to view all departments
export const viewAllDepartments = async () => {
  const result = await pool.query('SELECT id, name FROM department');
  console.table(result.rows);
};
// Function to view all roles
export const viewAllRoles = async () => {
    const result = await pool.query('SELECT r.id, r.title, r.salary, d.name AS department FROM role r JOIN department d ON r.department_id = d.id');
    console.table(result.rows);
  };
  // Function to view all employees
export const viewAllEmployees = async () => {
    const result = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, 
             COALESCE(m.first_name || ' ' || m.last_name, 'None') AS manager
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    console.table(result.rows);
  };
  // Function to add a new department
export const addDepartment = async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Enter the name of the department:',
      },
    ]);
    await pool.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
    console.log(`Added ${answers.name} to the database`);
  };
  // Function to add a new role
export const addRole = async () => {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(department => ({
      name: department.name,
      value: department.id,
    }));
  
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'Enter the title of the role:',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'Enter the salary of the role:',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Enter the department for the role:',
        choices: departmentChoices,
      },
    ]);
    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [answers.title, answers.salary, answers.department_id]);
    console.log(`Added ${answers.title} to the database`);
  };
  // Function to add a new employee
export const addEmployee = async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'first_name',
        message: 'What is the employee\'s first name?',
      },
      {
        type: 'input',
        name: 'last_name',
        message: 'What is the employee\'s last name?',
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'What is the employee\'s role?',
        choices: [
          { name: 'Sales Manager', value: 1 },
          { name: 'Sales Associate', value: 2 },
          { name: 'Software Engineer', value: 3 },
          { name: 'Data Scientist', value: 4 },
          { name: 'HR Manager', value: 5 },
          { name: 'Recruiter', value: 6 },
          { name: 'Marketing Manager', value: 7 },
          { name: 'Content Writer', value: 8 },
        ],
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Who is the employee\'s manager?',
        choices: [
          { name: 'None', value: null },
          { name: 'John Doe', value: 1 },
          { name: 'Jane Smith', value: 2 },
          { name: 'Alice Johnson', value: 3 },
          { name: 'Bob Brown', value: 4 },
          { name: 'Charlie Davis', value: 5 },
          { name: 'Eve Wilson', value: 6 },
          { name: 'Frank Miller', value: 7 },
          { name: 'Gamal Mubarak', value: 8 },
        ],
      },
    ]);
    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    console.log(`Added ${answers.first_name} ${answers.last_name} to the database`);
  };