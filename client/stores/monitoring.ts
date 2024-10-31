import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMonitoringStore = defineStore("monitoring", () => {
  const checkInStatus = ref(false);

  const recordCheckIn = async () => {
    const response = await fetchy("/api/monitoring/checkin", "POST");
    checkInStatus.value = response.status;
  };

  const resetCheckInStatus = async () => {
    await fetchy("/api/monitoring/reset", "PATCH");
    checkInStatus.value = false;
  };

  return {
    checkInStatus,
    recordCheckIn,
    resetCheckInStatus,
  };
});
