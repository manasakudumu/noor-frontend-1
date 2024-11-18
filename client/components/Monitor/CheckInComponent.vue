<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const checkInStatus = ref("");
const lastCheckInTime = ref("");
const message = ref("");
const isCheckingIn = ref(false);

async function checkIn() {
  isCheckingIn.value = true;
  try {
    const response = await fetchy("/api/monitoring/checkin", "POST", {});
    checkInStatus.value = "Checked In";
    lastCheckInTime.value = new Date(response.time).toLocaleString();
    message.value = response.msg;
  } catch (error) {
    console.error("Failed to check in:", error);
    message.value = "Failed to check in.";
  } finally {
    isCheckingIn.value = false;
  }
}
</script>

<template>
  <div class="checkin-container">
    <button @click="checkIn" :disabled="isCheckingIn" class="pure-button pure-button-primary">
      {{ isCheckingIn ? "Checking In..." : "Check In" }}
    </button>
    <p v-if="message">{{ message }}</p>
    <p v-if="lastCheckInTime">
      Last Check-In: <span>{{ lastCheckInTime }}</span>
    </p>
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
