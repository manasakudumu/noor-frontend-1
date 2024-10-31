<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const alertStatus = ref(false);
const loading = ref(false);
const errorMessage = ref("");

async function activateEmergencyAlert() {
  loading.value = true;
  errorMessage.value = ""; // Reset error message before trying

  try {
    await fetchy("/api/alert", "POST");
    alertStatus.value = true;
  } catch (error) {
    errorMessage.value = "Failed to activate emergency alert. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <main>
    <h1>Emergency Alert</h1>
    <button v-if="!alertStatus && !loading" @click="activateEmergencyAlert" class="emergency-button">Activate Emergency Alert</button>
    <p v-else-if="loading" class="loading">Activating...</p>
    <p v-else>Emergency alert is active. Trusted contacts have been notified.</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </main>
</template>

<style scoped>
:root {
  --primary-color: #3498db;
  --accent-color: #16a085;
  --text-color: #2c3e50;
  --background-color: #f8f9fa;
  --alert-color: #e74c3c;
  --loading-color: #f39c12;
}

main {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2em;
  background-color: var(--background-color);
  min-height: 100vh;
}

h1 {
  font-size: 2.5em;
  color: var(--text-color);
  margin-bottom: 1em;
}

.emergency-button {
  background-color: var(--alert-color);
  color: white;
  font-size: 1.2em;
  padding: 0.8em 1.5em;
  margin-top: 1em;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.emergency-button:hover {
  background-color: #c0392b;
  transform: scale(1.05);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
}

.loading {
  font-size: 1.2em;
  color: var(--loading-color);
  font-weight: bold;
  margin-top: 1em;
}

.error {
  color: var(--alert-color);
  font-weight: bold;
  margin-top: 1em;
  padding: 0.5em;
  border: 1px solid var(--alert-color);
  border-radius: 5px;
  background-color: #fdecea;
  width: max-content;
  text-align: center;
}
</style>
