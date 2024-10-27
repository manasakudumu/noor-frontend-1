<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const checkInStatus = ref("");
const message = ref("");

async function checkIn() {
  try {
    await fetchy("/api/monitoring/checkin", "POST", {});
    checkInStatus.value = "Checked In";
    message.value = "Check-in successful!";
  } catch (error) {
    message.value = "Failed to check in.";
  }
}
</script>

<template>
  <div class="checkin-container">
    <button @click="checkIn" class="pure-button pure-button-primary">Check In</button>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<style scoped>
.checkin-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1em;
}
</style>
