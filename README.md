# Task Management API

A simple Task Management System with a focus on backend development. 

## Introduction
This project is a backend API for managing tasks. It is built using Node.js and Express, with MongoDB as the database. The API provides endpoints for creating, updating, and deleting tasks. Asynchronous processing is implemented using RabbitMQ. Jest is used for unit testing.

## Installation
### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [MongoDB](https://www.mongodb.com/)
- [RabbitMQ](https://www.rabbitmq.com/)

### Steps
1. Clone the repository:
   ```sh
   git clone https://github.com/nickbarrie/Task-Managment-API.git
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Change directory to the project folder (if needed):
    ```sh
    cd Task-Managment-API
    ```
4. Create a `.env` file in the root of the project and add the following environment variables:
    ```
    PORT=5000
    MONGO_URI=mongodb://mongo:27017/task-manager-api
    RABBITMQ_URI=amqp://rabbitmq:5672
    NODE_ENV=run
    ```
5. Start the application:
    ``` 
    docker-compose up --build
    ```


## Usage

The API will be available at `http://localhost:5000`

The API provides the following endpoints:

- Create a new task
    - **URL**: `/tasks`
    - **Method**: `POST`
    - **Request Body**:
        ```json
        {
        "title": "Task 1",
        "description": "Description of Task 1",
        "completed": "false"
        }
        ```
    - **Response Body**:
        ```json
        {
            "message": "Task creation request sent to queue"
        }
        ```
  


- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a task by ID
- `PUT /tasks/:id` - Update a task by ID
- `DELETE /tasks/:id` - Delete a task by ID
