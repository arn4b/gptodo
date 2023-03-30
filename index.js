/* eslint-disable consistent-return */
/* eslint-disable linebreak-style */
const express = require('express');
const { v4: uuidv4 } = require('uuid');

const {
    createTodo, getTodoById, updateTodo, deleteTodoById,
} = require('./todos');
const { signUp, signIn } = require('./auth');
const { requestLogger } = require('./winston_logger');

const app = express();

app.use(express.json());
app.use(requestLogger);

// TODO ROUTES
app.post('/todos', async (req, res, next) => {
    if (!req.body) {
        const error = new Error('Request body is missing');
        error.status = 400;
        return next(error.message);
    }

    const {
        description, isCompleted,
    } = req.body;

    const id = uuidv4();
    const userId = uuidv4();

    if (!description) {
        const error = new Error('Missing required fields');
        error.status = 400;
        return next(error);
    }

    const todo = await createTodo(id, userId, description, isCompleted);

    if (todo) {
        res.status(201).json(todo);
    } else {
        res.status(500).json({ message: 'Failed to create todo' });
    }
});

app.get('/todos/:id', async (req, res) => {
    const todoId = req.params.id;
    const todo = await getTodoById(todoId);

    if (todo) {
        res.status(200).json(todo);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.put('/todos/:id', async (req, res) => {
    const todoId = req.params.id;
    const updatedAt = new Date().toISOString();
    const { title, description, isCompleted } = req.body;
    const updatedTodo = await updateTodo(todoId, title, description, isCompleted, updatedAt);

    if (updatedTodo) {
        res.status(200).json({ message: 'Todos Updated!' });
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

app.delete('/todos/:id', async (req, res) => {
    const todoId = req.params.id;
    const deletedTodo = await deleteTodoById(todoId);

    if (deletedTodo) {
        res.status(200).json(deletedTodo);
    } else {
        res.status(404).json({ message: 'Todo not found' });
    }
});

// AUTH ROUTES
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await signUp(email, password);
        res.json({ message: 'Signed Up Successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Unable to sign up user' });
    }
});

// Sign in an existing user
app.post('/api/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await signIn(email, password);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(401).json({ error: 'Incorrect email or password' });
    }
});

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
