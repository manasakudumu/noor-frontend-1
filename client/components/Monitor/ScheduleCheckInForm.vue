<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const time = ref("");
const contacts = ref("");
const message = ref("");

async function scheduleCheckIn() {
  try {
    await fetchy("/api/monitoring/schedule", "POST", {
      body: { time: time.value, contacts: contacts.value.split(",") },
    });
    message.value = "Check-in scheduled successfully!";
  } catch (error) {
    message.value = "Failed to schedule check-in.";
  }
}
</script>

<template>
  <form @submit.prevent="scheduleCheckIn" class="pure-form">
    <fieldset>
      <input v-model="time" type="datetime-local" placeholder="Check-in Time" required />
      <input v-model="contacts" type="text" placeholder="Trusted Contacts (comma-separated)" required />
      <button type="submit" class="pure-button pure-button-primary">Schedule Check-In</button>
    </fieldset>
    <p v-if="message">{{ message }}</p>
  </form>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}
</style>
