const request = require('supertest');
const app = require('../server'); 
const Task = require('../models/Task');
const { publishMessage } = require('../config/rabbitmq');

// Mock the Task model and publishMessage function
jest.mock('../models/Task');
jest.mock('../config/rabbitmq');

describe('Task API', () => {
    // Define mock data for tests
    const newTask = { title: 'Test Task', description: 'This is a test task.' };
    const tasks = [{ id: 1, title: 'Test Task 1' }, { id: 2, title: 'Test Task 2' }];
    const updatedTask = { title: 'Updated Task', description: 'Updated task description' };

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    it('should create a new task', async () => {
        // Mock the behavior of Task.create (for POST /tasks)
        Task.create.mockResolvedValue(newTask);
        publishMessage.mockResolvedValue(); // Mock publishMessage for success

        const response = await request(app)
            .post('/tasks')
            .send(newTask);

        expect(response.status).toBe(201);
        expect(response.body.message).toBe('Task creation request sent to queue');
        expect(publishMessage).toHaveBeenCalledWith({
            action: 'create',
            taskData: newTask,
        });
    });

    it('should retrieve all tasks', async () => {
        // Mock the behavior of Task.find (for GET /tasks)
        Task.find.mockResolvedValue(tasks);

        const response = await request(app).get('/tasks');

        expect(response.status).toBe(200);
        expect(response.body).toEqual(tasks);
        expect(Task.find).toHaveBeenCalledTimes(1); // Ensure find is called once
    });

    it('should retrieve a task by ID', async () => {
        // Mock Task.findById (for GET /tasks/:id)
        Task.findById.mockResolvedValue(tasks[0]);

        const response = await request(app).get(`/tasks/${tasks[0].id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(tasks[0]);
        expect(Task.findById).toHaveBeenCalledWith(tasks[0].id.toString());
    });

    it('should return 404 if task not found by ID', async () => {
        // Mock Task.findById to return null for a non-existing task
        Task.findById.mockResolvedValue(null);

        const response = await request(app).get('/tasks/999'); // Non-existent ID

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Task not found');
    });

    it('should update a task by ID', async () => {
        // Mock publishMessage for PUT /tasks/:id
        publishMessage.mockResolvedValue();

        const response = await request(app)
            .put(`/tasks/1`)
            .send(updatedTask);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task update request sent to queue');
        expect(publishMessage).toHaveBeenCalledWith({
            action: 'update',
            taskId: '1',
            taskData: updatedTask,
        });
    });

    it('should delete a task by ID', async () => {
        // Mock publishMessage for DELETE /tasks/:id
        publishMessage.mockResolvedValue();

        const response = await request(app).delete('/tasks/1');

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Task delete request sent to queue');
        expect(publishMessage).toHaveBeenCalledWith({
            action: 'delete',
            taskId: '1',
        });
    });
});
