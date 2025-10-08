import {IFieldRepository} from "@/frutech/modules/my-fields/domain/model/field.respository.js";
import {FieldAssembler} from "@/frutech/modules/my-fields/application/field.assembler.js";


const API_URL = import.meta.env.VITE_API_URL;
const PREVIEW_FIELDS_PATH = import.meta.env.VITE_PREVIEW_FIELDS_ENDPOINT_PATH;
const CROP_STATUS_PATH = import.meta.env.VITE_CROP_STATUS_ENDPOINT_PATH;
const FIELDS_PATH = import.meta.env.VITE_FIELDS_ENDPOINT_PATH;
const TASK_PATH = import.meta.env.VITE_TASK_ENDPOINT_PATH;

export class FieldApiRepository extends IFieldRepository {
    /**
     * Obtiene los datos de los endpoints y los transforma usando el Assembler.
     * @override
     * @returns {Promise<import('../domain/models/field.model').FieldModel[]>}
     */
    async getAll() {
        try {
            const [previewResponse, statusResponse] = await Promise.all([
                fetch(`${API_URL}${PREVIEW_FIELDS_PATH}`),
                fetch(`${API_URL}${CROP_STATUS_PATH}`)
            ]);

            if (!previewResponse.ok || !statusResponse.ok) {
                throw new Error('Error de red al obtener los datos de los campos.');
            }

            const previewFieldDTOs = await previewResponse.json();
            const cropStatusDTOs = await statusResponse.json();

            return FieldAssembler.toModel(previewFieldDTOs, cropStatusDTOs);

        } catch (error) {
            console.error('FieldApiRepository Error:', error);
            throw error;
        }
    }
    /**
     * Obtiene los datos detallados de un solo campo por su ID.
     * @param {string | number} id
     * @returns {Promise<any>} // En un caso real, usaríamos un Assembler para convertir a FieldDetailModel
     */
    async getById(id) {
        try {
            const response = await fetch(`${API_URL}${FIELDS_PATH}/${id}`);
            if (!response.ok) {
                throw new Error(`No se pudo encontrar el campo con ID ${id}.`);
            }
            return await response.json();
        } catch (error) {
            console.error('FieldApiRepository getById Error:', error);
            throw error;
        }
    }
    /**
     * Crea un nuevo campo enviando los datos a la API (db.json).
     * @returns {Promise<any>} - La respuesta del servidor con el objeto ya creado.
     * @param previewData
     * @param detailData
     */
    async create(previewData, detailData) {
        try {
            const [previewResponse, detailResponse] = await Promise.all([
                fetch(`${API_URL}${PREVIEW_FIELDS_PATH}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(previewData),
                }),
                fetch(`${API_URL}${FIELDS_PATH}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(detailData),
                }),
            ]);

            if (!previewResponse.ok || !detailResponse.ok) {
                console.error('Una de las respuestas del servidor no fue OK', {
                    previewStatus: previewResponse.status,
                    detailStatus: detailResponse.status,
                });
                throw new Error('No se pudo crear el nuevo campo en ambas colecciones.');
            }
            return await previewResponse.json();

        } catch (error) {
            console.error('FieldApiRepository create Error:', error);
            throw error;
        }
    }
    async updateField(id, fieldData) {
        try {
            const response = await fetch(`${API_URL}${FIELDS_PATH}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(fieldData),
            });
            if (!response.ok) throw new Error(`Could not update field with ID ${id}.`);
            return await response.json();
        } catch (error) {
            console.error('FieldApiRepository updateField Error:', error);
            throw error;
        }
    }

    /**
     * Agrega una nueva tarea a la lista global de tareas.
     * @param {object} taskData El objeto de la nueva tarea.
     * @returns {Promise<any>} Los datos de la tarea creada.
     */
    async addNewTask(taskData) {
        try {
            const response = await fetch(`${API_URL}${TASK_PATH}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });
            if (!response.ok) throw new Error('Could not create new task.');
            return await response.json();
        } catch (error) {
            console.error('FieldApiRepository addNewTask Error:', error);
            throw error;
        }
    }
}