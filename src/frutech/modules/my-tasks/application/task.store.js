import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { TaskApiRepository } from '../infrastructure/task-api.repository';
import { TaskAssembler } from './task.assembler';
import { Task } from '../domain/models/task.entity';

const repository = new TaskApiRepository();
const assembler = new TaskAssembler();

/**
 * @store useTaskStore
 * @description Pinia store to manage tasks state and actions.
 */
export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    const taskCount = computed(() => tasks.value.length);
    const completedTasks = computed(() => tasks.value.filter((t) => t.completed));
    const pendingTasks = computed(() => tasks.value.filter((t) => !t.completed));
    const overdueTasks = computed(() => tasks.value.filter((t) => t.isOverdue));

    /**
     * Sorts tasks by due date.
     */
    const sortedTasks = computed(() => {
        return [...tasks.value].sort((a, b) => {
            const dateA = parseDueDate(a.dueDate);
            const dateB = parseDueDate(b.dueDate);
            return dateA - dateB;
        });
    });

    /**
     * Parses a date string in DD/MM format.
     * @param {string} dateStr - Date string in DD/MM format.
     * @returns {Date}
     */
    function parseDueDate(dateStr) {
        const [day, month] = dateStr.split('/').map(Number);
        const year = new Date().getFullYear();
        return new Date(year, month - 1, day);
    }

    /**
     * Fetches all tasks from the API.
     */
    async function fetchTasks() {
        isLoading.value = true;
        error.value = null;
        try {
            const taskEntities = await repository.getAll();
            tasks.value = assembler.toDTOList(taskEntities);
        } catch (err) {
            error.value = 'Could not load tasks.';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Creates a new task.
     * @param {object} taskData - Object with task data { description, dueDate, field }.
     */
    async function createTask(taskData) {
        isLoading.value = true;
        error.value = null;
        try {
            const allTasks = await repository.getAll();
            const newId = allTasks.length > 0 
                ? Math.max(...allTasks.map(t => t.id)) + 1 
                : 1;
            
            const taskEntity = new Task({
                id: newId,
                description: taskData.description,
                dueDate: taskData.dueDate,
                field: taskData.field,
                completed: false,
            });

            const createdEntity = await repository.create(taskEntity);
            tasks.value.push(assembler.toDTO(createdEntity));
        } catch (err) {
            error.value = 'Could not create task.';
            console.error('Create task error:', err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Updates an existing task.
     * @param {number} taskId - The ID of the task to update.
     * @param {object} dataToUpdate - Object with new data { description, dueDate, field }.
     */
    async function updateTask(taskId, dataToUpdate) {
        isLoading.value = true;
        error.value = null;
        try {
            const taskEntity = await repository.getById(taskId);
            taskEntity.updateInformation(
                dataToUpdate.description,
                dataToUpdate.dueDate,
                dataToUpdate.field
            );
            const updatedEntity = await repository.update(taskEntity);
            const index = tasks.value.findIndex((t) => t.id === taskId);
            if (index !== -1) {
                tasks.value[index] = assembler.toDTO(updatedEntity);
            }
        } catch (err) {
            error.value = 'Could not update task.';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Toggles the completion status of a task.
     * @param {number} taskId - The ID of the task to toggle.
     */
    async function toggleTaskCompletion(taskId) {
        isLoading.value = true;
        error.value = null;
        try {
            const taskEntity = await repository.getById(taskId);
            if (taskEntity.completed) {
                taskEntity.markAsIncomplete();
            } else {
                taskEntity.markAsCompleted();
            }
            const updatedEntity = await repository.update(taskEntity);
            const index = tasks.value.findIndex((t) => t.id === taskId);
            if (index !== -1) {
                tasks.value[index] = assembler.toDTO(updatedEntity);
            }
        } catch (err) {
            error.value = 'Could not toggle task completion.';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Deletes a task.
     * @param {number} taskId - The ID of the task to delete.
     */
    async function deleteTask(taskId) {
        isLoading.value = true;
        error.value = null;
        try {
            await repository.delete(taskId);
            tasks.value = tasks.value.filter((t) => t.id !== taskId);
        } catch (err) {
            error.value = 'Could not delete task.';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Clears the error state.
     */
    function clearError() {
        error.value = null;
    }

    return {
        // State
        tasks,
        isLoading,
        error,

        // Computed
        taskCount,
        completedTasks,
        pendingTasks,
        overdueTasks,
        sortedTasks,

        // Actions
        fetchTasks,
        createTask,
        updateTask,
        toggleTaskCompletion,
        deleteTask,
        clearError,
    };
});
