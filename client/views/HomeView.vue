<script setup lang="ts">
import PostListComponent from "@/components/Post/PostListComponent.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { RouterLink } from "vue-router";

const { isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main class="home-container">
    <div>
      <header class="header">
        <h1>Welcome to Noor!</h1>
        <p class="intro-description">Use Noor to stay connected, and ensure your safety. Start a check-in, send an alert, or message trusted contacts.</p>
        <div class="button-container">
          <RouterLink :to="{ name: 'MonitoringStatus' }">
            <button class="main-button">Check-In</button>
          </RouterLink>
          <RouterLink :to="{ name: 'Messaging' }">
            <button class="main-button">Messages</button>
          </RouterLink>
          <RouterLink :to="{ name: 'Alerting' }">
            <button class="alert-button">Emergency Alert</button>
          </RouterLink>
          <RouterLink :to="{ name: 'TrustedContacts' }">
            <button class="main-button">Trusted Contacts</button>
          </RouterLink>
          <RouterLink :to="{ name: 'Posting' }">
            <button class="main-button">Post an Update</button>
          </RouterLink>
          <RouterLink :to="{ name: 'Profile' }">
            <button class="main-button">My Profile</button>
          </RouterLink>
        </div>
      </header>
      <section class="post-section">
        <h2>Latest Posts</h2>
        <PostListComponent />
      </section>
    </div>
  </main>
</template>

<style scoped>
:root {
  --button-color: rgb(110, 152, 137);
  --alert-color: rgb(244, 110, 110);
  --background-color: #f8f9fa;
  --text-color: #2c3e50;
  --font-family: "Playfair Display", serif;
}

.home-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background-color: var(--background-color);
  min-height: 100vh;
  font-family: var(--font-family);
}

.header {
  text-align: center;
  margin-bottom: 2em;
}

h1 {
  font-size: 2.8em;
  color: var(--text-color);
  margin: 0;
}

.intro-description {
  font-size: 1.2em;
  color: #7f8c8d;
  max-width: 600px;
  margin: 0.5em auto;
  line-height: 1.5;
}

.button-container {
  display: flex;
  gap: 1em;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1.5em;
}

.main-button {
  background-color: var(--button-color);
  color: white;
  padding: 0.8em 1.5em;
  font-size: 1em;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.alert-button {
  background-color: var(--alert-color);
  color: white;
  width: 60px;
  height: 60px;
  font-size: 0.9em;
  border-radius: 50%;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.main-button:hover,
.alert-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.post-section {
  width: 100%;
  max-width: 800px;
  padding: 2em;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 2em;
}

.login-prompt {
  text-align: center;
  font-size: 1.2em;
  color: var(--text-color);
}

.login-prompt p {
  max-width: 600px;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2em;
  }

  .intro-description {
    font-size: 1em;
    padding: 0 1em;
  }

  .button-container {
    gap: 0.5em;
  }

  .main-button {
    padding: 0.7em 1.2em;
    font-size: 0.9em;
  }

  .post-section {
    padding: 1.5em;
  }
}
</style>
