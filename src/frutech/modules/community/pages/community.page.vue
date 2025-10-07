<template>
  <Card>
    <template #title>
      <h1 class="m-0">{{ $t('sidebar.community') }}</h1>
    </template>
    <template #content>
      <p>
        Conéctate con otros agricultores, comparte consejos y participa en discusiones.
      </p>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
</script>