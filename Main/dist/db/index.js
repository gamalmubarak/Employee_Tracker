import express from 'express';
import { pool, connectToDb } from './connection.js';
await connectToDb();
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Routes
// GET all departments
app.get('/departments', async (_, res) => {
    try {
        const result = await pool.query('SELECT * FROM department');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// GET all roles
app.get('/roles', async (_, res) => {
    try {
        const result = await pool.query('SELECT * FROM role');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// GET all employees
app.get('/employees', async (_, res) => {
    try {
        const result = await pool.query('SELECT * FROM employee');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// POST a new department
app.post('/departments', async (req, res) => {
    const { name } = req.body;
    try {
        await pool.query('INSERT INTO department (name) VALUES ($1)', [name]);
        res.status(201).json({ message: 'Department added' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// POST a new role
app.post('/roles', async (req, res) => {
    const { title, salary, department_id } = req.body;
    try {
        await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
        res.status(201).json({ message: 'Role added' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// POST a new employee
app.post('/employees', async (req, res) => {
    const { first_name, last_name, role_id, manager_id } = req.body;
    try {
        await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id || null]);
        res.status(201).json({ message: 'Employee added' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// PUT update employee role
app.put('/employees/:id/role', async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;
    try {
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, id]);
        res.status(200).json({ message: 'Employee role updated' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
