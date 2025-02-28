const amqp = require('amqplib');  // Use the promise-based version

// Connect to RabbitMQ server
const connectRabbitMQ = async () => {
    const maxRetries = 5;
    let attempt = 0;
    
    while (attempt < maxRetries) {
        try {
            const connection = await amqp.connect(process.env.RABBITMQ_URI);
            const channel = await connection.createChannel();
            await channel.assertQueue('taskQueue', { durable: true });
            console.log("Connected to RabbitMQ and queue created");
            return channel;
        } catch (error) {
            attempt++;
            console.error(`RabbitMQ connection failed (Attempt ${attempt}):`, error);
            if (attempt === maxRetries) {
                throw error;
            }
            await new Promise(resolve => setTimeout(resolve, 2000));  // Wait before retry
        }
    }
};

const publishMessage = async (msg) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URI);
        const channel = await connection.createChannel();

        // Ensure the queue exists before sending a message
        await channel.assertQueue('taskQueue', { durable: true });

        // Send the message to the queue
        channel.sendToQueue('taskQueue', Buffer.from(JSON.stringify(msg)), {
            persistent: true,  // Ensure message survives server restarts
        });
        console.log('Message sent to queue');

        // Close the channel after sending the message
        await channel.close();
        await connection.close();
    } catch (error) {
        console.error("Error sending message to RabbitMQ:", error);
    }
};

module.exports = { connectRabbitMQ, publishMessage };
