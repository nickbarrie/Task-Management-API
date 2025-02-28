const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

/**
 * @route   POST /tasks
 * @desc    Create a new task
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route   GET /tasks
 * @desc    Read all tasks
 * @access  Public
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
 * @access  Public
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
 * @access  Public
 */
router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

/**
 * @route   DELETE /tasks/:id
 * @desc    Delete a task by ID
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
