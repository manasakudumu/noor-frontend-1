<script setup lang="ts">
import TrustedContactsComponent from "@/components/Alert/TrustedContactsComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

const contacts = ref([]);

async function loadContacts() {
  contacts.value = await fetchy("/api/alert/get-trusted-contacts", "GET");
}

onMounted(loadContacts);
</script>

<template>
  <main>
    <h1>Manage Trusted Contacts</h1>
    <TrustedContactsComponent :contacts="contacts" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1em;
}
</style>
