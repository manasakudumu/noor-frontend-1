<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute, useRouter } from "vue-router";

const currentRoute = useRoute();
const router = useRouter();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

async function logout() {
  await userStore.logoutUser();
  void router.push({ name: "Home" });
}

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <img src="@/assets/images/logo.svg" alt="App Logo" />
        <RouterLink :to="{ name: 'Home' }">
          <h1>Noor</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }" :class="{ active: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ active: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Profile' }" :class="{ active: currentRouteName == 'Profile' }"> Profile </RouterLink>
        </li>
        <li v-if="!isLoggedIn">
          <RouterLink :to="{ name: 'Login' }" :class="{ active: currentRouteName == 'Login' }"> Login </RouterLink>
          <RouterLink :to="{ name: 'Register' }" :class="{ active: currentRouteName == 'Register' }" style="margin-left: 0.5em"> Register </RouterLink>
        </li>
        <li v-else>
          <button @click="logout" aria-label="Logout" class="logout-button">Logout</button>
        </li>
      </ul>
    </nav>
    <transition name="fade">
      <article v-if="toast !== null" class="toast" :class="toast.style">
        <p>{{ toast.message }}</p>
      </article>
    </transition>
  </header>
  <RouterView />
  <footer>Created by Manasa Kudumu</footer>
</template>

<style scoped>
@import "./assets/toast.css";

* {
  box-sizing: border-box;
}

nav {
  padding: 1em 2em;
  background: linear-gradient(135deg, #84a9ac, #3b6978);
  display: flex;
  align-items: center;
  color: white;
  border-bottom: 2px solid #3b6978;
  font-family: "Helvetica Neue", Arial, sans-serif;
}

body {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

h1 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  padding: 0.5em 0;
}

p {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 1em;
  margin: 0.5em 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2.5em;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  gap: 1em;
  align-items: center;
}

a {
  font-size: 1.1em;
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

a:hover,
.logout-button:hover {
  color: #3b6978;
}

.active {
  color: #ffeb3b; /* Distinct color to indicate the active page */
  font-weight: bold;
}

.logout-button {
  background: transparent;
  border: none;
  font-size: 1.1em;
  color: white;
  cursor: pointer;
  transition: color 0.3s ease;
}

.toast {
  padding: 1em;
  border-radius: 0.5em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 1em;
  background-color: rgba(0, 0, 0, 0.8); /* Darker background for readability */
  color: white;
  transition: all 0.5s ease;
}

footer {
  padding: 2em;
  background-color: #3b6978;
  color: white;
  text-align: center;
  font-size: 1em;
  font-family: "Helvetica Neue", Arial, sans-serif;
  position: fixed;
  width: 100%;
  bottom: 0;
}

:root {
  --button-color: #16a085;
  --button-hover-color: #149174;
}

button {
  background-color: var(--button-color);
  color: white;
  padding: 0.8em 1.5em;
  border: none;
  border-radius: 5px;
  font-size: 1em;
  font-family: "Helvetica Neue", Arial, sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: var(--button-hover-color);
}

/* Transition styles */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  nav {
    padding: 1em;
    flex-direction: column;
  }

  ul {
    flex-direction: column;
    gap: 0.5em;
  }

  h1 {
    font-size: 1.5em;
  }
}
</style>
