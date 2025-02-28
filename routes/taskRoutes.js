const express = require('express');
const Task = require('../models/Task');
const { connectRabbitMQ, publishMessage  } = require('../config/rabbitmq');
const router = express.Router();

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
        res.status(500).json({ error: 'Internal server error' });
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
        res.status(500).json({ error: error.message });
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
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route   PUT /tasks/:id
 * @desc    Update a task by ID
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Extract task ID from the URL
        const taskData = req.body;  // Extract task data (updated fields) from the request body

        // Send an update request to the RabbitMQ queue
        await publishMessage({
            action: 'update',
            taskId: id,   // Send the task ID to the worker
            taskData      // Send the updated task data
        });

        res.status(200).json({ message: 'Task update request sent to queue' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a task by ID
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Extract task ID from the URL

        // Send a delete request to the RabbitMQ queue
        await publishMessage({
            action: 'delete',
            taskId: id   // Send the task ID to the worker to delete it
        });

        res.status(200).json({ message: 'Task delete request sent to queue' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
