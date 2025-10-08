<template>
  <div class="community-header">
    <h1 class="title">What Our Community Says</h1>
    <p class="subtitle">
      Real feedback from real users who have transformed their workflow with our application. Join thousands of satisfied customers worldwide.
    </p>
    <span class="comments-count">{{ commentsCount }} Comments</span>
  </div>
</template>

<script setup>
defineProps({
  commentsCount: {
    type: Number,
    default: 0
  }
});
</script>

<style scoped>
.community-header {
  margin-bottom: 2rem;
}
.title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}
.subtitle {
  color: #6c757d;
  margin-bottom: 0.5rem;
}
.comments-count {
  font-size: 1rem;
  color: #333;
  font-weight: 500;
}
</style>