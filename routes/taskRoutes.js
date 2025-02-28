const express = require('express');
const Task = require('../models/Task');
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
router.post('/', async (req, res) => {
    try {
        const taskData = req.body;
        
        await publishMessage({
            action: 'create',
            taskData
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
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        handleError(res, error);
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
