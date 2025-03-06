
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
  // Function to update an employee's role
export const updateEmployeeRole = async () => {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
  
    const roles = await pool.query('SELECT id, title FROM role');
    const roleChoices = roles.rows.map(role => ({
      name: role.title,
      value: role.id,
    }));
  
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for the employee:',
        choices: roleChoices,
      },
    ]);
    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);
    console.log(`Updated employee's role in the database`);
  };
  // Function to update an employee's manager
export const updateEmployeeManager = async () => {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
  
    const managers = await pool.query('SELECT id, first_name, last_name FROM employee');
    const managerChoices = managers.rows.map(manager => ({
      name: `${manager.first_name} ${manager.last_name}`,
      value: manager.id,
    }));
  
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee to update:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the new manager for the employee:',
        choices: managerChoices,
      },
    ]);
    await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [answers.manager_id, answers.employee_id]);
    console.log(`Updated employee's manager in the database`);
  };
  // Function to view employees by manager
export const viewEmployeesByManager = async () => {
    const result = await pool.query(`
      SELECT m.id AS manager_id, m.first_name AS manager_first_name, m.last_name AS manager_last_name, 
             e.id AS employee_id, e.first_name AS employee_first_name, e.last_name AS employee_last_name, 
             r.title AS employee_role
      FROM employee e
      LEFT JOIN employee m ON e.manager_id = m.id
      LEFT JOIN role r ON e.role_id = r.id
      WHERE e.manager_id IS NOT NULL
      ORDER BY m.id, e.id
    `);
    console.table(result.rows);
  };
  // Function to prompt for department selection
export const departmentPrompt = () => {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Which department would you like to see employees for?',
        choices: [
          { name: 'Sales', value: 1 },
          { name: 'Engineering', value: 2 },
          { name: 'Human Resources', value: 3 },
          { name: 'Marketing', value: 4 },
        ],
      },
    ]);
  };
  
  // Function to view employees by department
  export const viewEmployeesByDepartment = async () => {
    const answers = await departmentPrompt();
    const result = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, r.title AS job_title, d.name AS department, r.salary, 
             COALESCE(m.first_name || ' ' || m.last_name, 'None') AS manager
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
      WHERE r.department_id = $1
    `, [answers.department_id]);
    console.table(result.rows);
  };
  // Function to delete a department
export const deleteDepartment = async () => {
    const departments = await pool.query('SELECT id, name FROM department');
    const departmentChoices = departments.rows.map(department => ({
      name: department.name,
      value: department.id,
    }));
  
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'department_id',
        message: 'Choose the department you want to delete:',
        choices: departmentChoices,
      },
    ]);
    await pool.query('DELETE FROM department WHERE id = $1', [answers.department_id]);
    console.log(`Deleted department from the database`);
  };
  // Function to delete a role
export const deleteRole = async () => {
    const roles = await pool.query('SELECT id, title FROM role');
    const roleChoices = roles.rows.map(role => ({
      name: role.title,
      value: role.id,
    }));
  
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'role_id',
        message: 'Choose the role you want to delete:',
        choices: roleChoices,
      },
    ]);
    await pool.query('DELETE FROM role WHERE id = $1', [answers.role_id]);
    console.log(`Deleted role from the database`);
  };
  // Function to delete an employee
export const deleteEmployee = async () => {
    const employees = await pool.query('SELECT id, first_name, last_name FROM employee');
    const employeeChoices = employees.rows.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
  
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Choose the employee you want to delete:',
        choices: employeeChoices,
      },
    ]);
    await pool.query('DELETE FROM employee WHERE id = $1', [answers.employee_id]);
    console.log(`Deleted employee from the database`);
  };
  // Function to view the total utilized budget of each department
export const viewDepartmentBudget = async () => {
    const result = await pool.query(`
      SELECT d.name AS department, SUM(r.salary) AS total_budget
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      GROUP BY d.name
    `);
    console.table(result.rows);
  };