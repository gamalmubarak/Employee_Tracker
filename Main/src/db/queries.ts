
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