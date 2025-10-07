/**
 * @file Vue Router configuration.
 * @description This file sets up all the application routes, including lazy-loading
 * for feature components and defines the main layout structure.
 */

import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../shared/layouts/main-layout.component.vue';
import LoginPage from '@/frutech/modules/auth/pages/login.page.vue';

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
    },
    {
        path: '/',
        component: MainLayout,
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/frutech/modules/dashboard/pages/dashboard.page.vue'),
            },
            {
                path: 'manage-crops',
                name: 'ManageCrops',
                component: () => import('@/frutech/modules/manage-crops/pages/manage-crops.page.vue'),
            },
            {
                path: 'my-fields',
                name: 'MyFields',
                component: () => import('@/frutech/modules/my-fields/pages/my-fields.page.vue'),
            },
            {
                path: 'my-tasks',
                name: 'MyTasks',
                component: () => import('@/frutech/modules/my-tasks/pages/my-tasks.page.vue'),
            },
            {
                path: 'community',
                name: 'Community',
                component: () => import('@/frutech/modules/community/pages/community.page.vue'),
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/frutech/modules/profile/pages/profile.page.vue'),
            },
            {
                path: '',
                redirect: '/dashboard',
            },
        ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;