<script setup lang="ts">
import AlertingComponent from "@/components/Alert/AlertingComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const currentRoute = useRoute();
// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
const currentRouteName = computed(() => currentRoute.name);
</script>

<template>
  <main>
    <h1 class="main-heading">Welcome to Noor!</h1>
    <h3>Let your light, light up the world!</h3>
    <section>
      <h2 v-if="isLoggedIn">Welcome back, {{ currentUsername }}!</h2>
      <h2 v-else>Log in to access safety features.</h2>
    </section>
    <p class="intro-description">Use Noor to stay in touch with loved ones and ensure your safety. Navigate to start a check-in, send an alert, or message trusted contacts.</p>
    <div class="button-container">
      <RouterLink :to="{ name: 'CheckIn' }">
        <button class="main-button">Start a Check-In</button>
      </RouterLink>
      <RouterLink :to="{ name: 'Messaging' }">
        <button class="main-button">Messages</button>
      </RouterLink>
      <RouterLink :to="{ name: 'Post' }">
        <button class="main-button">Post an Update</button>
      </RouterLink>
    </div>
    <AlertingComponent />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.intro-description {
  text-align: center;
  margin: 1em 0;
}

.button-container {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  justify-content: center;
}

.main-button {
  padding: 0.8em 1.5em;
  font-size: 1.2em;
  border-radius: 5px;
  cursor: pointer;
}
</style>
