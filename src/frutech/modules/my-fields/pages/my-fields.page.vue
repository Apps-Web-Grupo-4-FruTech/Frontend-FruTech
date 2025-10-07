<template>
  <Card>
    <template #title>
      <h1 class="m-0">{{ $t('sidebar.myFields') }}</h1>
    </template>
    <template #content>
      <p>
        Visualiza y administra tus campos. Puedes verlos en un mapa, editar sus detalles y más.
      </p>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
</script>