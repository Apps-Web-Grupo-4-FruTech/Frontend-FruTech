<template>
  <Card>
    <template #title>
      <h1 class="m-0">{{ $t('sidebar.community') }}</h1>
    </template>
    <template #content>
      <p>
        Real feedback from real users who have transformed their workflow with our application. Join thousands of satisfied customers worldwide.
      </p>
    </template>
  </Card>
</template>

<script setup>
import Card from 'primevue/card';
</script>