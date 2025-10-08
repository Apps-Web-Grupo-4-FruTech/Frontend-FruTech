<template>
  <div class="community-comment-card">
    <div class="card-header">
      <span class="author">{{ comment.author }}</span>
      <span class="role">{{ comment.role }}</span>
    </div>
    <div class="card-content">
      <p class="text">"{{ comment.text }}"</p>
    </div>
    <div class="card-footer">
      <span class="date">{{ comment.date }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  comment: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.community-comment-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 1.5rem;
  background: #fff;
}
.card-header {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  display: flex;
  flex-direction: column;
}
.author {
  font-size: 1.15rem;
}
.role {
  font-size: 1rem;
  color: #6c757d;
  font-weight: 400;
}
.card-content {
  margin: 1rem 0;
}
.text {
  font-size: 1rem;
  color: #333;
}
.card-footer {
  text-align: right;
  font-size: 0.95rem;
  color: #6c757d;
}
</style>