<script setup lang="ts">
import AlertingComponent from "@/components/Alert/AlertingComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { RouterLink, useRoute } from "vue-router";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);

const activateEmergencyAlert = () => {
  // Trigger emergency alert here if additional functionality is needed
};
</script>

<template>
  <main>
    <div class="header">
      <h1 class="main-heading">Welcome to Noor!</h1>
      <h3>Let your light, light up the world!</h3>
    </div>
    <section>
      <h2 v-if="isLoggedIn">Welcome back, {{ currentUsername }}!</h2>
      <h2 v-else>Log in to access safety features.</h2>
    </section>
    <p class="intro-description">Use Noor to stay connected and ensure your safety. Start a check-in, send an alert, or message trusted contacts.</p>
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
    <button @click="activateEmergencyAlert" class="emergency-button" aria-label="Activate Emergency Alert"></button>
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 2em;
}

.header {
  text-align: center;
}

.intro-description {
  text-align: center;
  margin: 1em 0;
  font-size: 1.1em;
  color: #666;
  max-width: 80%;
}

.button-container {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  justify-content: center;
  margin: 1.5em 0;
}

.main-button {
  padding: 0.8em 1.5em;
  font-size: 1.1em;
  border-radius: 5px;
  cursor: pointer;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  color: #333;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.main-button:hover {
  background-color: #333;
  color: #f5f5f5;
}

.emergency-button {
  position: fixed;
  bottom: 1em;
  right: 1em;
  background-color: red;
  color: white;
  font-size: 1.5em;
  width: 3.5em;
  height: 3.5em;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: none;
}

.emergency-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}
</style>
