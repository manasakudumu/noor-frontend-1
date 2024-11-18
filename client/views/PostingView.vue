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
  <main class="posting-container">
    <h1 class="posting-heading">Community Feed</h1>
    <button class="main-button">Create New Post</button>
    <section class="post-list">
      <PostListComponent :posts="posts" />
    </section>
  </main>
</template>

<style scoped>
:root {
  --primary-color: #3498db;
  --accent-color: #16a085;
  --text-color: #2c3e50;
  --background-color: #f8f9fa;
  --font-family: "Playfair Display", serif;
}

.posting-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background-color: var(--background-color);
  min-height: 100vh;
  font-family: var(--font-family);
}

.posting-heading {
  font-size: 2.5em;
  color: var(--text-color);
  margin-bottom: 1.5em;
  text-align: center;
}

.main-button {
  margin: 1em 0;
  padding: 0.8em 1.5em;
  font-size: 1em;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--accent-color);
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.post-list {
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1.5em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 2em;
}

@media (max-width: 768px) {
  .posting-heading {
    font-size: 2em;
  }

  .post-list {
    padding: 1em;
  }
}
</style>
