<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

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
          <RouterLink :to="{ name: 'Home' }" :class="{ underline: currentRouteName == 'Home' }"> Home </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }" :class="{ underline: currentRouteName == 'Settings' }"> Settings </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Profile' }" :class="{ underline: currentRouteName == 'Profile' }"> Profile </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }" :class="{ underline: currentRouteName == 'Login' }"> Login </RouterLink>
          <RouterLink :to="{ name: 'Register' }" :class="{ underline: currentRouteName == 'Register' }" style="margin-left: 0.5em"> Register </RouterLink>
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

h1 {
  font-size: 1.8em;
  margin: 0;
  color: white;
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

a:hover {
  color: #3b6978;
}

.underline {
  text-decoration: underline;
}

.toast {
  padding: 1em;
  border-radius: 0.5em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 1em;
  transition: all 0.5s ease;
}

footer {
  padding: 2em;
  margin-top: 1em;
  background-color: #3b6978;
  color: white;
  text-align: center;
  font-size: 1em;
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
