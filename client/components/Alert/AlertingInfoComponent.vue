<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

interface AlertInfo {
  _id: string;
  location: string;
  activatedAt: string;
  status: boolean;
}

const alertInfo = ref<AlertInfo | null>(null);
const loaded = ref(false);
const error = ref("");

async function fetchAlertInfo() {
  try {
    const response = await fetchy("/api/alert/info", "GET", {});
    alertInfo.value = response as AlertInfo;
    error.value = "";
  } catch (err) {
    error.value = "Failed to fetch alert information";
    console.error(err);
  } finally {
    loaded.value = true;
  }
}

onBeforeMount(fetchAlertInfo);
</script>

<template>
  <div v-if="loaded" class="alert-info">
    <h3>Alert Information</h3>
    <p v-if="alertInfo">
      <strong>Status:</strong> {{ alertInfo.status ? "Active" : "Inactive" }}<br />
      <strong>Location:</strong> {{ alertInfo.location }}<br />
      <strong>Activated At:</strong> {{ alertInfo.activatedAt }}
    </p>
    <p v-else>No alert information available.</p>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.alert-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 1em;
}

.error {
  color: red;
  margin-top: 1em;
}
</style>
