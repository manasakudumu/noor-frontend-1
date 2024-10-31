import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useAlertingStore = defineStore("alerting", () => {
  const alertStatus = ref(false);

  const activateEmergencyAlert = async () => {
    await fetchy("/api/alert", "POST");
    alertStatus.value = true;
  };

  const deactivateEmergencyAlert = async () => {
    await fetchy("/api/alert/deactivate", "POST");
    alertStatus.value = false;
  };

  return {
    alertStatus,
    activateEmergencyAlert,
    deactivateEmergencyAlert,
  };
});
