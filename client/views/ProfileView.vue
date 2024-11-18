<script setup lang="ts">
import TrustedContactsComponent from "@/components/Alert/TrustedContactsComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

const username = ref("");
const bio = ref("");
const trustedContacts = ref([]);

async function loadProfileData() {
  const profile = await fetchy("/api/user/profile", "GET");
  username.value = profile.username;
  bio.value = profile.bio;
  trustedContacts.value = profile.trustedContacts;
}

onMounted(loadProfileData);
</script>

<template>
  <main class="profile-container">
    <section class="profile-header">
      <h1 class="profile-username">{{ username }}</h1>
      <p class="profile-bio">{{ bio }}</p>
      <button class="main-button">Edit Profile</button>
    </section>
    <section class="trusted-contacts-section">
      <h2 class="contacts-heading">Trusted Contacts</h2>
      <TrustedContactsComponent :contacts="trustedContacts" />
    </section>
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

.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background-color: var(--background-color);
  min-height: 100vh;
  font-family: var(--font-family);
}

.profile-header {
  text-align: center;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1.5em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2em;
  width: 100%;
  max-width: 600px;
}

.profile-username {
  font-size: 2.5em;
  color: var(--text-color);
  margin-bottom: 0.5em;
}

.profile-bio {
  font-size: 1.2em;
  color: var(--text-color);
  margin-bottom: 1em;
}

.main-button {
  margin-top: 1em;
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

.trusted-contacts-section {
  width: 100%;
  max-width: 600px;
  padding: 1.5em;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.contacts-heading {
  font-size: 2em;
  color: var(--text-color);
  margin-bottom: 1em;
  text-align: center;
}

@media (max-width: 768px) {
  .profile-username {
    font-size: 2em;
  }
  .contacts-heading {
    font-size: 1.5em;
  }

  .profile-header,
  .trusted-contacts-section {
    padding: 1em;
  }
}
</style>
