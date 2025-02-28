require('dotenv').config();
const amqp = require('amqplib');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const connectDB = require('./config/db');

const RABBITMQ_URI = process.env.RABBITMQ_URI;
const MONGO_URI = process.env.MONGO_URI;

const processMessage = async (msg) => {
    console.log("Received message:", msg.content.toString());
    const { action, taskId, taskData } = JSON.parse(msg.content.toString());

    try {
        if (action === 'create') {
            const newTask = new Task(taskData);
            await newTask.save();
            console.log(`Task created: ${newTask.id}`);
        } else if (action === 'update') {
            await Task.findByIdAndUpdate(taskId, taskData, { new: true });
            console.log(`Task updated: ${taskId}`);
        } else if (action === 'delete') {
            await Task.findByIdAndDelete(taskId);
            console.log(`Task deleted: ${taskId}`);
        }
    } catch (error) {
        console.error(`Error processing ${action}:`, error);
    }
};

const startWorker = async () => {
    try {
        await connectDB();
        let connection;
        let channel;
        let retryCount = 0;
        
        while (!connection) {
            console.log(`RabbitMQ connection (Attempt ${retryCount})`);
            try {
                connection = await amqp.connect(RABBITMQ_URI);
                channel = await connection.createChannel();
                await channel.assertQueue('taskQueue', { durable: true });
                console.log('Worker is listening for messages...');
            } catch (error) {
                retryCount++;
                console.error('RabbitMQ connection failed, retrying...', error);
                await new Promise(resolve => setTimeout(resolve, 10000));  
            }
        }

        channel.consume('taskQueue', async (msg) => {
            if (msg !== null) {
                await processMessage(msg);
                channel.ack(msg);
            }
        });
    } catch (error) {
        console.error('Worker error:', error);
    }
};

startWorker();
