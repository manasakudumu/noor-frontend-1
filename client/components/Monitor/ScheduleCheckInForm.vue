<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { ref } from "vue";

const scheduleTime = ref("");
const trustedContacts = ref("");
const message = ref("");

async function scheduleCheckIn() {
  try {
    const response = await fetchy("/api/monitoring/schedule", "POST", {
      body: { schedule: scheduleTime.value, trustedContacts: trustedContacts.value.split(",") },
    });
    message.value = response.msg;
  } catch (error) {
    console.error("Failed to schedule check-in:", error);
    message.value = "Failed to schedule check-in.";
  }
}
</script>

<template>
  <div class="schedule-container">
    <h1>Schedule Check-In</h1>
    <form @submit.prevent="scheduleCheckIn" class="pure-form">
      <fieldset>
        <label for="schedule-time">Check-In Time:</label>
        <input v-model="scheduleTime" type="datetime-local" id="schedule-time" required />
        <label for="trusted-contacts">Trusted Contacts (comma-separated IDs):</label>
        <input v-model="trustedContacts" type="text" id="trusted-contacts" required />
        <button type="submit" class="pure-button pure-button-primary">Schedule</button>
      </fieldset>
    </form>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
}
</style>
