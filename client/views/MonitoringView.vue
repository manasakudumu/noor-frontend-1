<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

const checkInStatus = ref(false);
const lastCheckInTime = ref("");
const scheduledCheckIn = ref("");
const message = ref("");

async function loadMonitoringInfo() {
  try {
    const info = await fetchy("/api/monitoring/status", "GET");
    checkInStatus.value = info.status;
    lastCheckInTime.value = info.lastCheckIn?.toLocaleString() || "Not available";
    scheduledCheckIn.value = info.schedule?.toLocaleString() || "Not scheduled";
  } catch (error) {
    console.error("Failed to fetch monitoring info:", error);
    message.value = "Failed to load monitoring status.";
  }
}

async function resetStatus() {
  try {
    const response = await fetchy("/api/monitoring/reset-status", "POST");
    checkInStatus.value = false;
    message.value = response.msg;
  } catch (error) {
    console.error("Failed to reset status:", error);
    message.value = "Failed to reset status.";
  }
}

onMounted(loadMonitoringInfo);
</script>

<template>
  <main class="monitoring-container">
    <h1 class="monitoring-heading">Monitoring Status</h1>
    <div class="status-info">
      <p>
        Status: <span>{{ checkInStatus ? "Active" : "Missed" }}</span>
      </p>
      <p>
        Last Check-In: <span>{{ lastCheckInTime }}</span>
      </p>
      <p>
        Scheduled Check-In: <span>{{ scheduledCheckIn }}</span>
      </p>
      <button v-if="!checkInStatus" class="main-button" @click="resetStatus">Reset Status</button>
      <p v-if="message">{{ message }}</p>
    </div>
  </main>
</template>

<style scoped>
:root {
  --primary-color: #3498db;
  --accent-color: #16a085;
  --text-color: #2c3e50;
  --background-color: #f8f9fa;
  --font-family: "Playfair Display", serif;
}

.monitoring-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background-color: var(--background-color);
  min-height: 100vh;
  font-family: var(--font-family);
}

.monitoring-heading {
  font-size: 2.5em;
  color: var(--text-color);
  margin-bottom: 1.5em;
  text-align: center;
}

.status-info {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 2em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: left;
}

.status-info p {
  font-size: 1.2em;
  color: var(--text-color);
  margin: 0.5em 0;
}

.status-info p span {
  font-weight: bold;
}

.main-button {
  margin-top: 1.5em;
  padding: 0.8em 1.5em;
  font-size: 1em;
  border-radius: 8px;
  cursor: pointer;
  background-color: var(--accent-color);
  color: white;
  border: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.main-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .monitoring-heading {
    font-size: 2em;
  }

  .status-info {
    padding: 1.5em;
  }
}
</style>
