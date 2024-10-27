<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { defineProps } from "vue";
const props = defineProps(["checkIn"]);
</script>

<template>
  <div class="checkin-info">
    <div><strong>Time:</strong> {{ checkIn.time }}</div>
    <div><strong>Status:</strong> {{ checkIn.status ? "Checked In" : "Pending" }}</div>
    <div><strong>Location:</strong> {{ checkIn.location }}</div>
  </div>
</template>

<style scoped>
.checkin-info {
  padding: 1em;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
