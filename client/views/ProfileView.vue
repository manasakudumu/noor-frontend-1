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
  <main>
    <section class="profile-header">
      <h1>{{ username }}</h1>
      <p>{{ bio }}</p>
      <button class="main-button">Edit Profile</button>
    </section>
    <section>
      <h2>Trusted Contacts</h2>
      <TrustedContactsComponent :contacts="trustedContacts" />
    </section>
  </main>
</template>

<style scoped>
.profile-header {
  text-align: center;
  margin: 2em 0;
}
.main-button {
  margin-top: 1em;
}
</style>
