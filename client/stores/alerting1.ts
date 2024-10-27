import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAlertingStore = defineStore("alerting", () => {
  const alertStatus = ref(false);
  const trustedContacts = ref([]);

  const activateEmergencyAlert = async () => {
    await fetchy("/api/alert", "POST");
    alertStatus.value = true;
  };

  const deactivateEmergencyAlert = async () => {
    await fetchy("/api/alert/deactivate", "POST");
    alertStatus.value = false;
  };

  const fetchTrustedContacts = async () => {
    trustedContacts.value = await fetchy("/api/alert/get-trusted-contacts", "GET");
  };

  const addTrustedContact = async (name: string, phone: string) => {
    await fetchy("/api/alert/add-trusted-contact", "POST", { body: { name, phone } });
    await fetchTrustedContacts();
  };

  const removeTrustedContact = async (contactId: string) => {
    await fetchy("/api/alert/remove-trusted-contact", "DELETE", { body: { contactId } });
    await fetchTrustedContacts();
  };

  return {
    alertStatus,
    trustedContacts,
    activateEmergencyAlert,
    deactivateEmergencyAlert,
    fetchTrustedContacts,
    addTrustedContact,
    removeTrustedContact,
  };
});
