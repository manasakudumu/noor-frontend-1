<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import MonitoringInfoComponent from "./MonitoringInfoComponent.vue";

interface CheckIn {
  _id: string;
  time: string;
  status: boolean;
  location: string;
}

const checkIns = ref<CheckIn[]>([]);
const loaded = ref(false);

async function getCheckIns() {
  try {
    checkIns.value = await fetchy("/api/monitoring/checkins", "GET", {});
  } catch (error) {
    console.error("Failed to load check-ins", error);
  }
}

onBeforeMount(async () => {
  await getCheckIns();
  loaded.value = true;
});
</script>

<template>
  <section v-if="loaded && checkIns.length">
    <article v-for="checkIn in checkIns" :key="checkIn._id">
      <MonitoringInfoComponent :checkIn="checkIn" />
    </article>
  </section>
  <p v-else-if="loaded">No check-ins found.</p>
  <p v-else>Loading Check-ins...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
</style>
