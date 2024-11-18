<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="settings-container">
    <h1 class="settings-heading">Settings for {{ currentUsername }}</h1>
    <div class="settings-buttons">
      <button class="main-button" @click="logout">Logout</button>
      <button class="button-error main-button" @click="delete_">Delete User</button>
    </div>
    <section class="update-form-section">
      <UpdateUserForm />
    </section>
  </main>
</template>

<style scoped>
:root {
  --primary-color: rgb(110, 152, 137);
  --accent-color: #16a085;
  --text-color: #2c3e50;
  --background-color: #f8f9fa;
  --error-color: #e74c3c;
  --font-family: "Playfair Display", serif;
}

.settings-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background-color: var(--background-color);
  min-height: 100vh;
  font-family: var(--font-family);
}

.settings-heading {
  font-size: 2.5em;
  color: var(--text-color);
  margin-bottom: 1.5em;
  text-align: center;
}

.settings-buttons {
  display: flex;
  gap: 1em;
  margin-bottom: 2em;
}

.main-button {
  padding: 0.8em 1.5em;
  font-size: 1em;
  border-radius: 8px;
  cursor: pointer;
  background-color: rgb(110, 152, 137);
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.button-error {
  background-color: var(--error-color);
}

.button-error:hover {
  background-color: #c0392b;
}

.update-form-section {
  width: 100%;
  max-width: 600px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 2em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .settings-heading {
    font-size: 2em;
  }

  .main-button {
    padding: 0.7em 1.2em;
    font-size: 0.9em;
  }

  .update-form-section {
    padding: 1.5em;
  }
}
</style>
