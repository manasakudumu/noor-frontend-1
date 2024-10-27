<!-- DeactivateAlert.vue -->
<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { defineEmits } from "vue";

const emit = defineEmits(["updateStatus"]);

async function deactivateAlert() {
  try {
    await fetchy("/api/alert/deactivate", "POST");
    emit("updateStatus"); // Notify parent component to update status
  } catch (error) {
    console.error("Failed to deactivate alert:", error);
  }
}
</script>

<template>
  <button class="deactivate-button" @click="deactivateAlert">Deactivate Emergency Alert</button>
</template>

<style scoped>
.deactivate-button {
  background-color: gray;
  color: white;
  border: none;
  padding: 0.5em 1em;
  cursor: pointer;
}
</style>
