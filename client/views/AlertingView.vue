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
    <button v-if="!alertStatus" @click="activateEmergencyAlert" class="emergency-button">Activate Emergency Alert</button>
    <p v-else>Emergency alert is active. Trusted contacts have been notified.</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </main>
</template>

<style scoped>
.emergency-button {
  background-color: red;
  color: white;
  font-size: 1.5em;
  padding: 1em;
  margin-top: 1em;
}
.error {
  color: red;
  font-weight: bold;
  margin-top: 1em;
}
</style>
