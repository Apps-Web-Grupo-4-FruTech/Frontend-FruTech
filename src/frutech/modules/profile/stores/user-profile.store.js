import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { UserProfileApiRepository } from '../infrastructure/user-profile.api-repository';
import { UserProfileAssembler } from '../application/user-profile.assembler';

const repository = new UserProfileApiRepository();
const assembler = new UserProfileAssembler();

/**
 * @store useUserProfileStore
 * @description Pinia store to manage user profile state and actions.
 * @author Estefano Solis
 */
export const useUserProfileStore = defineStore('user-profile', () => {
    const profile = ref(null);
    const isLoading = ref(false);
    const error = ref(null);

    const hasProfile = computed(() => !!profile.value);

    /**
     * Fetches the user profile from the API and saves it to the state.
     * @param {number} userId - The ID of the user to fetch.
     */
    async function fetchProfile(userId) {
        isLoading.value = true;
        error.value = null;
        try {
            const profileEntity = await repository.getById(userId);
            if (profileEntity) {
                profile.value = assembler.toDTO(profileEntity);
            } else {
                throw new Error('Profile not found.');
            }
        } catch (err) {
            error.value = 'Could not load profile.';
            console.error(err);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Updates the user's personal information.
     * @param {object} dataToUpdate - Object with new data (name, phoneNumber, identificator).
     */
    async function updateProfile(dataToUpdate) {
        if (!profile.value) return;
        isLoading.value = true;
        error.value = null;
        try {
            const currentEntity = await repository.getById(profile.value.id);
            currentEntity.updateInformation(
                dataToUpdate.name,
                dataToUpdate.phoneNumber,
                dataToUpdate.identificator
            );
            const updatedEntity = await repository.update(currentEntity);
            profile.value = assembler.toDTO(updatedEntity);
        } catch (err) {
            error.value = 'Could not update profile.';
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Changes the user's password.
     * @param {object} passwordData - Object with { currentPassword, newPassword, confirmPassword }.
     */
    async function changePassword({ currentPassword, newPassword, confirmPassword }) {
        if (!profile.value) return;
        if (newPassword !== confirmPassword) {
            throw new Error('errors.passwordsDontMatch');
        }
        isLoading.value = true;
        try {
            await repository.updatePassword(profile.value.id, currentPassword, newPassword);
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Deletes the user's account.
     */
    async function deleteAccount() {
        if (!profile.value) return;
        isLoading.value = true;
        try {
            await repository.delete(profile.value.id);
            profile.value = null;
        } catch (err) {
            console.error(err);
            throw err;
        } finally {
            isLoading.value = false;
        }
    }

    return {
        profile,
        isLoading,
        error,
        hasProfile,
        fetchProfile,
        updateProfile,
        changePassword,
        deleteAccount
    };
});