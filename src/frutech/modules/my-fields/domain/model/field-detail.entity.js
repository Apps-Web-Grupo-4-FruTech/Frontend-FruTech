import { Field } from './field.entity.js';

export class FieldDetail extends Field {
  constructor(data) {
    super(data);

    this.progressHistory = this.validateProgressHistory(data.progressHistory || data.progress_history || []);
    this.progress_history = this.progressHistory;
    this.progressHistoryId = data.progressHistoryId || null;
    this.tasks = this.validateTasks(data.tasks || []);
  }

  validateProgressHistory(progressHistory) {
    if (!Array.isArray(progressHistory)) {
      return [];
    }

    return progressHistory.map(item => {
      if (!item || typeof item !== 'object') {
        return {
          id: null,
          date: '',
          watered: '',
          fertilized: '',
          pests: ''
        };
      }

      return {
        id: item.id ?? item.Id ?? null,
        date: item.date ?? item.Date ?? '',
        watered: item.watered ?? item.Watered ?? '',
        fertilized: item.fertilized ?? item.Fertilized ?? '',
        pests: item.pests ?? item.Pests ?? ''
      };
    });
  }

  validateTasks(tasks) {
    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks.map(task => {
      if (!task || typeof task !== 'object') {
        return {
          id: null,
          description: '',
          dueDate: '',
          date: '',
          completed: false,
          name: '',
          task: ''
        };
      }

      return {
        id: task.id ?? task.Id ?? null,
        description: task.description ?? task.Description ?? '',
        dueDate: task.dueDate ?? task.due_date ?? task.DueDate ?? '',
        date: task.date ?? '',
        completed: task.completed ?? task.Completed ?? false,
        name: task.name ?? task.fieldName ?? task.field_name ?? '',
        task: task.task ?? task.description ?? task.Description ?? ''
      };
    });
  }

  hasProgressHistory() {
    return this.progressHistory && this.progressHistory.length > 0;
  }

  hasTasks() {
    return this.tasks && this.tasks.length > 0;
  }

  getCompletedTasksCount() {
    return this.tasks.filter(task => task.completed).length;
  }

  getPendingTasksCount() {
    return this.tasks.filter(task => !task.completed).length;
  }

  getLatestProgress() {
    if (!this.hasProgressHistory()) {
      return null;
    }
    return this.progressHistory[this.progressHistory.length - 1];
  }
}
