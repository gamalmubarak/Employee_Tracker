import inquirer from 'inquirer';
import { viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployeeRole, updateEmployeeManager, viewEmployeesByManager, viewEmployeesByDepartment, deleteDepartment, deleteRole, deleteEmployee, viewDepartmentBudget } from './db/queries.js';
// Main prompt function
export const mainPrompt = async () => {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'mainMenu',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Update an employee manager',
          'View employees by manager',
          'View employees by department',
          'Delete a department',
          'Delete a role',
          'Delete an employee',
          'View total utilized budget of a department',
          'Quit',
        ],
      },
    ]);

    switch (answers.mainMenu) {
        case 'View all departments':
          await viewAllDepartments();
          break;
        case 'View all roles':
          await viewAllRoles();
          break;
        case 'View all employees':
          await viewAllEmployees();
          break;
        case 'Add a department':
          await addDepartment();
          break;
        case 'Add a role':
          await addRole();
          break;
        case 'Add an employee':
          await addEmployee();
          break;
        case 'Update an employee role':
          await updateEmployeeRole();
          break;
        case 'Update an employee manager':
          await updateEmployeeManager();
          break;
        case 'View employees by manager':
          await viewEmployeesByManager();
          break;
        case 'View employees by department':
          await viewEmployeesByDepartment();
          break;
        case 'Delete a department':
          await deleteDepartment();
          break;
        case 'Delete a role':
          await deleteRole();
          break;
        case 'Delete an employee':
          await deleteEmployee();
          break;
        case 'View total utilized budget of a department':
          await viewDepartmentBudget();
          break;
        case 'Quit':
          console.log('Goodbye!');
          process.exit();
      }
    
      mainPrompt();
    };
    
    mainPrompt();