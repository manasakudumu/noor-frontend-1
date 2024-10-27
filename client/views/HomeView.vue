<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <header class="header">
      <h1>Welcome to Noor!</h1>
      <h2 v-if="isLoggedIn" class="welcome-message">Let your light, light up the world ⭐️ {{ currentUsername }}!</h2>
      <h3 v-else>Log in to access safety features.</h3>
      <p class="intro-description">Use Noor to stay connected, and ensure your safety. Start a check-in, send an alert, or message trusted contacts.</p>
    </header>
    <section class="post-section">
      <h2>Latest Posts</h2>
      <PostListComponent />
    </section>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5em;
  font-family: Arial, sans-serif;
}

.header {
  text-align: center;
  margin-bottom: 2em;
}

h1 {
  font-size: 2.5em;
  color: #2c3e50;
}

.welcome-message {
  color: #16a085;
  font-size: 1.8em;
  margin-top: 0.5em;
}

.intro-description {
  font-size: 1.2em;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0.5em auto;
}

.post-section {
  width: 100%;
  max-width: 800px;
  padding: 1em;
  border-top: 1px solid #ecf0f1;
}

h2 {
  font-size: 2em;
  color: #2c3e50;
  margin-bottom: 1em;
}
</style>
