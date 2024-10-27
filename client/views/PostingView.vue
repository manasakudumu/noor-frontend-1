<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

const posts = ref([]);

async function loadPosts() {
  posts.value = await fetchy("/api/posts", "GET");
}

onMounted(loadPosts);
</script>

<template>
  <main>
    <h1>Community Feed</h1>
    <button class="main-button">Create New Post</button>
    <PostListComponent :posts="posts" />
  </main>
</template>

<style scoped>
.main-button {
  margin: 1em 0;
}
</style>
