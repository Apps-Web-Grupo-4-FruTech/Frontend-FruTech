<template>
  <div class="dashboard-page">
    <div v-if="store.isLoading" class="flex justify-content-center align-items-center h-20rem">
      <ProgressSpinner />
    </div>

    <div v-else-if="store.error" class="p-4">
      <Message severity="error" :closable="false">{{ store.error }}</Message>
    </div>

    <div v-else-if="store.dashboardData" class="grid gap-4">
      <div class="col-12">
        <Card class="preview-fields-card">
          <template #title>
            <div class="flex justify-content-between align-items-center">
              <h2 class="m-0 text-xl font-semibold">Mis Cultivos</h2>
              <Button label="Añadir Nuevo Cultivo" icon="pi pi-plus" />
            </div>
          </template>
          <template #content>
            <div class="field-items-container">
              <div v-for="field in store.dashboardData.previewFields" :key="field.id" class="field-item">
                <img :src="field.imageUrl" :alt="field.title" class="field-image">
                <span class="field-title mt-2">{{ field.title }}</span>
              </div>
            </div>
          </template>
        </Card>
      </div>

      <div class="col-12">
        <Card>
          <template #title><h2 class="m-0 text-xl font-semibold">Tareas Recientes</h2></template>
          <template #content>
            <DataTable :value="store.dashboardData.upcomingTasks" responsiveLayout="scroll">
              <Column field="name" header="Nombre del Cultivo"></Column>
              <Column field="task" header="Tarea"></Column>
              <Column field="date" header="Fecha Límite"></Column>
              <Column header="Acciones">
                <template #body>
                  <Button label="Ver" class="p-button-text p-button-sm mr-2" />
                  <Button label="Editar" class="p-button-text p-button-sm" />
                </template>
              </Column>
            </DataTable>
          </template>
        </Card>
      </div>

      <div class="col-12">
        <Card>
          <template #title><h2 class="m-0 text-xl font-semibold">Últimas Recomendaciones</h2></template>
          <template #content>
            <div v-for="rec in store.dashboardData.recommendations" :key="rec.id" class="mb-3">
              <p><strong class="font-semibold">{{ rec.title }}:</strong> {{ rec.content }}</p>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useDashboardStore } from '../stores/dashboard.store';

// Componentes de PrimeVue
import Card from 'primevue/card';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const store = useDashboardStore();

onMounted(() => {
  // Si no hay datos, los buscamos.
  if (!store.dashboardData) {
    store.fetchDashboardData();
  }
});
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.preview-fields-card .p-card-content {
  padding-top: 0;
}

.field-items-container {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  padding-bottom: 1rem; /* Espacio para la barra de scroll */
}

/* Ocultar barra de scroll pero mantener funcionalidad */
.field-items-container::-webkit-scrollbar {
  display: none;
}
.field-items-container {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

.field-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 180px;
}

.field-image {
  width: 180px;
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.field-title {
  font-size: 0.9rem;
  text-align: center;
  color: var(--p-text-color);
}
</style>