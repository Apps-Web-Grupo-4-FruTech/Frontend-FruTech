<template>
  <div class="community-comment-list">
    <community-comment-card
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
    />
  </div>
</template>

<script setup>
import CommunityCommentCard from './community-comment-card.component.vue';

defineProps({
  comments: {
    type: Array,
    default: () => []
  }
});
</script>

<style scoped>
.community-comment-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>