const express = require('express');
const Task = require('../models/Task');
const authMiddleware = require('../middleware/authMiddleware'); 
const { publishMessage } = require('../config/rabbitmq');
const router = express.Router();

/**
 * Helper function for handling errors
 */
const handleError = (res, error, statusCode = 500) => {
    console.error(error);  // Log the full error stack for debugging purposes
    res.status(statusCode).json({ error: error.message || 'Internal server error' });
};

/**
 * @route   POST /tasks
 * @desc    Create a new task
 */
router.post('/', authMiddleware, async (req, res) => { 
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        const task = new Task({ 
            title, 
            description, 
            completed: false, 
            userId: req.userId 
        });

        // Fixed: Use `task` instead of undefined `taskData`
        await publishMessage({
            action: 'create',
            taskData: {
                id: task._id,
                title: task.title,
                description: task.description,
                completed: task.completed,
                userId: task.userId
            }
        });

        res.status(201).json({ message: 'Task creation request sent to queue' });
    } catch (error) {
        handleError(res, error);
    }
});


/**
 * @route   GET /tasks
 * @desc    Read all tasks
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        console.log("Authenticated User ID:", req.userId); // Debugging
        const tasks = await Task.find({ userId: req.userId });

        if (!tasks.length) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});


/**
 * @route   GET /tasks/:id
 * @desc    Read a single task by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        handleError(res, error, 400); // Bad Request if ID format is invalid
    }
});

/**
 * @route   PUT /tasks/:id
 * @desc    Update a task by ID
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const taskData = req.body;

        await publishMessage({
            action: 'update',
            taskId: id,
            taskData
        });

        res.status(200).json({ message: 'Task update request sent to queue' });
    } catch (error) {
        handleError(res, error);
    }
});

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a task by ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await publishMessage({
            action: 'delete',
            taskId: id
        });

        res.status(200).json({ message: 'Task delete request sent to queue' });
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;
