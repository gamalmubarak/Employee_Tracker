
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