<template>
  <Card>
    <template #title>
      <h1 class="m-0">{{ $t('sidebar.myTasks') }}</h1>
    </template>
    <template #content>
      <p>
        Organiza tus tareas diarias. Marca las tareas completadas y añade nuevas.
      </p>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
</script>