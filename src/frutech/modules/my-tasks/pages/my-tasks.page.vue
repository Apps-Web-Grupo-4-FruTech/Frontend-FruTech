<template>
  <div class="my-tasks-container">
    <Card>
      <template #title>
        <div class="header-section">
          <h1 class="m-0">{{ $t('sidebar.myTasks') }}</h1>
          <div class="total-tasks">
            <span class="label">Total Tasks</span>
            <span class="count">{{ taskStore.taskCount }}</span>
          </div>
        </div>
      </template>
      <template #content>
        <p class="description">
          Organize your daily tasks. Mark completed tasks and add new ones.
        </p>

        <TaskList 
          :tasks="taskStore.sortedTasks"
          :is-loading="taskStore.isLoading"
          @toggle-task="handleToggleTask"
          @edit-task="handleEditTask"
          @delete-task="handleDeleteTask"
        />

        <div class="add-task-section">
          <Button 
            label="New Task" 
            icon="pi pi-plus"
            severity="success"
            @click="showTaskDialog = true"
          />
        </div>
      </template>
    </Card>

    <TaskForm 
      v-model:visible="showTaskDialog"
      :task="selectedTask"
      :available-fields="availableFields"
      @submit="handleSaveTask"
      @cancel="handleCancelDialog"
    />

    <DeleteTaskDialog 
      v-model:visible="showDeleteDialog"
      @confirm="handleConfirmDelete"
      @cancel="taskToDelete = null"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useTaskStore } from '../application/task.store';
import Card from 'primevue/card';
import Button from 'primevue/button';
import TaskList from '../presentation/views/task-list.component.vue';
import TaskForm from '../presentation/views/task-form.component.vue';
import DeleteTaskDialog from '../presentation/views/delete-task-dialog.component.vue';


/**
 * MyTasks Page Component
 * This component serves as the main page for managing user tasks.
 * It integrates the TaskList, TaskForm, and DeleteTaskDialog components,
 * and interacts with the TaskStore for state management.
 */

const taskStore = useTaskStore();

const showTaskDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedTask = ref(null);
const taskToDelete = ref(null);

const availableFields = ref([
  'Campo de Granos, Los Grandes',
  'Papas del Sol',
  'Parcela de Maíz La Serrana',
  'Invernadero de Tomates',
  'Campo de Zanahorias Beta',
]);

onMounted(() => {
  taskStore.fetchTasks();
});

const handleToggleTask = async (taskId) => {
  try {
    await taskStore.toggleTaskCompletion(taskId);
  } catch (error) {
    console.error('Error toggling task:', error);
  }
};

const handleEditTask = (task) => {
  selectedTask.value = task;
  showTaskDialog.value = true;
};

const handleDeleteTask = (task) => {
  taskToDelete.value = task;
  showDeleteDialog.value = true;
};

const handleSaveTask = async (taskData) => {
  try {
    if (selectedTask.value) {
      await taskStore.updateTask(selectedTask.value.id, taskData);
    } else {
      await taskStore.createTask(taskData);
    }
    showTaskDialog.value = false;
    selectedTask.value = null;
  } catch (error) {
    console.error('Error saving task:', error);
  }
};

const handleConfirmDelete = async () => {
  if (taskToDelete.value) {
    try {
      await taskStore.deleteTask(taskToDelete.value.id);
      taskToDelete.value = null;
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }
};

const handleCancelDialog = () => {
  showTaskDialog.value = false;
  selectedTask.value = null;
};
</script>

<style scoped>
.my-tasks-container {
  padding: 1rem;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-tasks {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0.5rem 1rem;
  background: var(--primary-50);
  border-radius: 8px;
}

.total-tasks .label {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
}

.total-tasks .count {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
}

.description {
  color: var(--text-color-secondary);
  margin-bottom: 2rem;
}

.add-task-section {
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}
</style>