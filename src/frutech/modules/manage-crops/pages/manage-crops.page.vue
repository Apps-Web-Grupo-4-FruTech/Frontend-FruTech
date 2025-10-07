<template>
  <Card>
    <template #title>
      <h1 class="m-0">{{ $t('sidebar.manageCrops') }}</h1>
    </template>
    <template #content>
      <p>
        Aquí podrás gestionar tus cultivos, añadir nuevos, y ver su estado actual.
      </p>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
</script>