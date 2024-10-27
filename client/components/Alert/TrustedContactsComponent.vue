<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

interface Contact {
  contactId: string; // Define contactId type as string
  name: string;
  phone: string;
}

const contacts = ref<Contact[]>([]);
const name = ref("");
const phone = ref("");

// Fetch trusted contacts
async function getContacts() {
  try {
    contacts.value = await fetchy("/api/alert/get-trusted-contacts", "GET");
  } catch (error) {
    console.error("Failed to load contacts", error);
  }
}

// Add a new trusted contact
async function addContact() {
  try {
    await fetchy("/api/alert/add-trusted-contact", "POST", {
      body: { name: name.value, phone: phone.value },
    });
    await getContacts();
  } catch (error) {
    console.error("Failed to add contact", error);
  }
}

// Remove a trusted contact by contactId
async function removeContact(contactId: string) {
  try {
    await fetchy(`/api/alert/remove-trusted-contact`, "DELETE", {
      body: { contactId },
    });
    await getContacts();
  } catch (error) {
    console.error("Failed to remove contact", error);
  }
}

onMounted(getContacts);
</script>

<template>
  <div>
    <h2>Trusted Contacts</h2>
    <div v-for="contact in contacts" :key="contact.contactId">
      <span>{{ contact.name }} - {{ contact.phone }}</span>
      <button @click="removeContact(contact.contactId)">Remove</button>
    </div>
    <form @submit.prevent="addContact">
      <input v-model="name" placeholder="Contact Name" required />
      <input v-model="phone" placeholder="Phone Number" required />
      <button type="submit">Add Contact</button>
    </form>
  </div>
</template>
