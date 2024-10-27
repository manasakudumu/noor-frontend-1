import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMonitoringStore = defineStore("monitoring", () => {
  const checkIns = ref([]);
  const monitoringStatus = ref(null);

  const scheduleCheckIn = async (scheduleTime: string) => {
    await fetchy("/api/monitoring/schedule", "POST", { body: { scheduleTime } });
    await fetchMonitoringStatus();
  };

  const fetchMonitoringStatus = async () => {
    monitoringStatus.value = await fetchy("/api/monitoring/status", "GET");
  };

  const recordCheckIn = async () => {
    await fetchy("/api/monitoring/checkin", "POST");
    await fetchMonitoringStatus();
  };

  return {
    checkIns,
    monitoringStatus,
    scheduleCheckIn,
    fetchMonitoringStatus,
    recordCheckIn,
  };
});
