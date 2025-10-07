<template>
  <div>
    <Card>
      <template #title>
        <h1 class="m-0">{{ $t('sidebar.dashboard') }}</h1>
      </template>
      <template #content>
        <p>
          Bienvenido al panel de control. Aquí podrás visualizar la información más relevante de tu actividad.
        </p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card';
</script>