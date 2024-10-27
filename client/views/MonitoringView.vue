<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

const checkInStatus = ref("");
const lastCheckInTime = ref("");
const scheduledCheckIn = ref("");

async function loadMonitoringInfo() {
  const info = await fetchy("/api/monitoring/status", "GET");
  checkInStatus.value = info.status;
  lastCheckInTime.value = info.lastCheckInTime;
  scheduledCheckIn.value = info.scheduledCheckIn;
}

onMounted(loadMonitoringInfo);
</script>

<template>
  <main>
    <h1>Monitoring Status</h1>
    <div>
      <p>Status: {{ checkInStatus }}</p>
      <p>Last Check-In: {{ lastCheckInTime }}</p>
      <p>Scheduled Check-In: {{ scheduledCheckIn }}</p>
      <button class="main-button">Schedule Check-In</button>
    </div>
  </main>
</template>

<style scoped>
.main-button {
  margin-top: 1em;
}
</style>
