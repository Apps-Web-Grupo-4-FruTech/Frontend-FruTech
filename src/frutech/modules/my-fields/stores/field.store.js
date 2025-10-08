import { defineStore } from 'pinia';
import { ref } from 'vue';
import { FieldApiRepository } from '../infrastructure/field.api-repository.js';

const fieldRepository = new FieldApiRepository();

export const useFieldStore = defineStore('fields', () => {
    const fields = ref([]);
    const currentField = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    async function fetchFields() {
        isLoading.value = true;
        error.value = null;
        try {
            const allFields = await fieldRepository.getAll();
            fields.value = allFields;
        } catch (e) {
            error.value = 'No se pudieron cargar los campos.';
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    }
    async function fetchFieldById(id) {
        isLoading.value = true;
        error.value = null;
        currentField.value = null;
        try {
            currentField.value = await fieldRepository.getById(id);
        } catch (e) {
            error.value = 'No se pudo cargar la información del campo.';
            console.error(e);
        } finally {
            isLoading.value = false;
        }
    }

    async function createField(fieldData) {
        isLoading.value = true;
        error.value = null;
        try {
            const newId = Date.now();
            const previewPayload = {
                id: newId,
                title: fieldData.name,
                image_url: fieldData.imageUrl,
            };
            const detailPayload = {
                id: newId,
                image_url: fieldData.imageUrl,
                name: fieldData.name,
                location: fieldData.location,
                field_size: fieldData.size,
                status: "Healthy",
                product: "", crop: "", days_since_planting: "0", planting_date: "",
                expecting_harvest: "", "Soil Type": "", watering: "", sunlight: "",
                progress_history: [{ watered: "", fertilized: "", pests: "" }], tasks: []
            };


            await fieldRepository.create(previewPayload, detailPayload);
            await fetchFields();

        } catch (e) {
            error.value = 'No se pudo guardar el campo.';
            console.error(e);
            throw e;
        } finally {
            isLoading.value = false;
        }
    }
    async function updateFieldProgress(fieldId, newProgress) {
        isLoading.value = true;
        error.value = null;
        try {
            const updatedField = await fieldRepository.updateField(fieldId, {
                progress_history: [newProgress]
            });
            currentField.value = updatedField;
        } catch (e) {
            error.value = 'Failed to update progress.';
            throw e;
        } finally {
            isLoading.value = false;
        }
    }

    async function addTaskToField(fieldId, taskData) {
        isLoading.value = true;
        error.value = null;
        try {
            const newTaskInGlobalList = await fieldRepository.addNewTask({
                description: taskData.task,
                due_date: taskData.date,
                field: taskData.name
            });

            const currentTasks = currentField.value.tasks || [];
            const newTasksArray = [
                ...currentTasks,
                {
                    id: newTaskInGlobalList.id,
                    date: taskData.date,
                    name: taskData.name,
                    task: taskData.task,
                }
            ];

            const updatedField = await fieldRepository.updateField(fieldId, {
                tasks: newTasksArray
            });

            currentField.value = updatedField;
        } catch (e) {
            error.value = 'Failed to add task.';
            throw e;
        } finally {
            isLoading.value = false;
        }
    }
    return {
        fields,
        currentField,
        isLoading,
        error,
        fetchFields,
        fetchFieldById,
        createField,
        updateFieldProgress,
        addTaskToField
    };
});