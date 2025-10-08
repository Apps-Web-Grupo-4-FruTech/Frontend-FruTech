import axios from 'axios';
import { TaskRepository } from '../domain/repositories/task.repository';
import { Task } from '../domain/models/task.entity';

/**
 * @class TaskApiRepository
 * @classdesc Repository implementation that interacts with a REST API to manage tasks.
 * @extends TaskRepository
 */
export class TaskApiRepository extends TaskRepository {
    baseURL = 'http://localhost:3000';
    endpoint = '/task';

    /**
     * Gets the Axios instance for API calls.
     */
    get http() {
        return axios.create({
            baseURL: this.baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Maps API data to the Task domain model.
     * @param {object} apiData - The raw data from the API.
     * @returns {Task} An instance of the Task entity.
     */
    apiToDomain(apiData) {
        return new Task({
            id: apiData.id,
            description: apiData.description,
            dueDate: apiData.due_date,
            field: apiData.field,
            completed: apiData.completed || false,
        });
    }

    /**
     * Maps a Task domain entity to a plain object for API submission.
     * @param {Task} domainData - The domain entity.
     * @returns {object} A plain object compatible with the API.
     */
    domainToApi(domainData) {
        return {
            id: domainData.id,
            description: domainData.description,
            due_date: domainData.dueDate,
            field: domainData.field,
            completed: domainData.completed,
        };
    }

    /**
     * Gets all tasks from the API.
     * @returns {Promise<Array<Task>>} Array of task entities.
     */
    async getAll() {
        try {
            const response = await this.http.get(this.endpoint);
            return response.data.map((item) => this.apiToDomain(item));
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }

    /**
     * Gets a task by ID from the API.
     * @param {number} id - The task's ID.
     * @returns {Promise<Task>} The task entity.
     */
    async getById(id) {
        try {
            const response = await this.http.get(`${this.endpoint}/${id}`);
            return this.apiToDomain(response.data);
        } catch (error) {
            console.error(`Error fetching task ${id}:`, error);
            throw error;
        }
    }

    /**
     * Creates a new task via the API.
     * @param {Task} task - The task entity to create.
     * @returns {Promise<Task>} The created task entity.
     */
    async create(task) {
        try {
            const apiData = this.domainToApi(task);
            const response = await this.http.post(this.endpoint, apiData);
            return this.apiToDomain(response.data);
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    /**
     * Updates a task via the API.
     * @param {Task} task - The task entity to update.
     * @returns {Promise<Task>} The updated task entity.
     */
    async update(task) {
        try {
            const apiData = this.domainToApi(task);
            const response = await this.http.put(`${this.endpoint}/${task.id}`, apiData);
            return this.apiToDomain(response.data);
        } catch (error) {
            console.error(`Error updating task ${task.id}:`, error);
            throw error;
        }
    }

    /**
     * Deletes a task via the API.
     * @param {number} id - The ID of the task to delete.
     * @returns {Promise<void>}
     */
    async delete(id) {
        try {
            await this.http.delete(`${this.endpoint}/${id}`);
        } catch (error) {
            console.error(`Error deleting task ${id}:`, error);
            throw error;
        }
    }
}
