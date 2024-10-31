import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTrustedContactsStore = defineStore("trustedContacts", () => {
  const contacts = ref([]);

  const fetchContacts = async () => {
    contacts.value = await fetchy("/api/alert/get-trusted-contacts", "GET");
  };

  const addContact = async (name: string, phone: string) => {
    await fetchy("/api/alert/add-trusted-contact", "POST", {
      body: { name, phone },
    });
    await fetchContacts();
  };

  const removeContact = async (contactId: string) => {
    await fetchy(`/api/alert/remove-trusted-contact`, "DELETE", {
      body: { contactId },
    });
    await fetchContacts();
  };

  return {
    contacts,
    fetchContacts,
    addContact,
    removeContact,
  };
});
