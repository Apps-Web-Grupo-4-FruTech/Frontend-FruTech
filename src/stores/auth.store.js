/**
 * @file Pinia store for authentication management.
 * @description This store handles the user's authentication state, including the user object
 * and JWT token. It provides actions for login and logout.
 */

import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    /**
     * The state of the authentication store.
     * @returns {{user: object|null, token: string|null}}
     */
    state: () => ({
        user: null,
        token: localStorage.getItem('token') || null,
    }),
    /**
     * Getters for the authentication store.
     */
    getters: {
        /**
         * Checks if the user is currently authenticated.
         * @param {object} state - The store's state.
         * @returns {boolean} True if the user is authenticated.
         */
        isAuthenticated: (state) => !!state.token,
    },
    /**
     * Actions for the authentication store.
     */
    actions: {
        /**
         * Simulates a user login, sets the token, and stores it in localStorage.
         * @param {object} credentials - The user's login credentials.
         */
        async login(credentials) {
            const fakeToken = 'fake-jwt-token';
            this.token = fakeToken;
            localStorage.setItem('token', fakeToken);
            this.user = { name: 'User', email: credentials.email };
        },

        /**
         * Logs out the user by clearing the state and removing the token from localStorage.
         */
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('token');
        },
    },
});