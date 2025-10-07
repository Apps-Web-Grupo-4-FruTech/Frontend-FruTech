import http from '@/services/http-common.js';
import { UserProfileRepository } from '../domain/repositories/user-profile.repository';
import { UserProfile } from '../domain/models/user-profile.model';

/**
 * @class UserProfileApiRepository
 * @classdesc Repository implementation that interacts with a REST API to manage user profiles.
 * @extends UserProfileRepository
 * @author Estefano Solis
 */
export class UserProfileApiRepository extends UserProfileRepository {
    endpoint = import.meta.env.VITE_USER_ENDPOINT_PATH;

    /**
     * Maps API data to the UserProfile domain model.
     * @param {object} apiData - The raw data from the API.
     * @returns {UserProfile} An instance of the UserProfile entity.
     */
    apiToDomain(apiData) {
        return new UserProfile({
            id: apiData.id,
            name: apiData.user_name,
            email: apiData.email,
            phoneNumber: apiData.phone_number,
            identificator: apiData.identificator,
            password: apiData.password,
        });
    }

    /**
     * Maps a UserProfile domain entity to a plain object for API submission.
     * @param {UserProfile} domainData - The domain entity.
     * @returns {object} A plain object compatible with the API.
     */
    domainToApi(domainData) {
        return {
            id: domainData.id,
            user_name: domainData.name,
            email: domainData.email,
            phone_number: domainData.phoneNumber,
            identificator: domainData.identificator,
            password: domainData.password,
        };
    }

    /**
     * Gets a user profile by ID from the API.
     * @param {number} id - The user's ID.
     * @returns {Promise<UserProfile>} The user profile entity.
     */
    async getById(id) {
        const response = await http.get(this.endpoint);
        const userData = response.data.find(user => user.id === id);
        if (!userData) throw new Error('User not found');
        return this.apiToDomain(userData);
    }

    /**
     * Updates a user profile by sending data to the API.
     * @param {UserProfile} userProfile - The profile entity to update.
     * @returns {Promise<UserProfile>} The updated entity returned by the API.
     */
    async update(userProfile) {
        const apiData = this.domainToApi(userProfile);
        const response = await http.put(`${this.endpoint}/${userProfile.id}`, apiData);
        return this.apiToDomain(response.data);
    }

    /**
     * Updates a user's password in the database via the API.
     * @param {number} userId - The user's ID.
     * @param {string} currentPassword - The current password for verification.
     * @param {string} newPassword - The new password.
     * @returns {Promise<boolean>} True if the update was successful.
     */
    async updatePassword(userId, currentPassword, newPassword) {
        const response = await http.get(`${this.endpoint}/${userId}`);
        const currentUserData = response.data;

        if (currentUserData.password !== currentPassword) {
            throw new Error('errors.passwordsDontMatch');
        }

        const updatedUserData = {
            ...currentUserData,
            password: newPassword,
        };

        await http.put(`${this.endpoint}/${userId}`, updatedUserData);
        return true;
    }

    /**
     * Deletes a user profile from the API.
     * @param {number} id - The ID of the user to delete.
     * @returns {Promise<void>}
     */
    async delete(id) {
        await http.delete(`${this.endpoint}/${id}`);
    }
}