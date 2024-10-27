<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Welcome to Noor!</h1>
    <section>
      <h1 v-if="isLoggedIn">Let your light, light up the worldworld{{ currentUsername }}!</h1>
      <h3 v-else>Log in to access safety features.</h3>
      <p>Use Noor to stay connected and ensure your safety. Start a check-in, send an alert, or message trusted contacts.</p>
    </section>
    <PostListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
