import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMessagingStore = defineStore("messaging", () => {
  const messages = ref([]);

  const fetchMessages = async () => {
    try {
      messages.value = await fetchy("/api/messages", "GET");
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const sendMessage = async (recipient: string, content: string) => {
    try {
      await fetchy("/api/messages/send", "POST", {
        body: { recipient, messageText: content },
      });
      await fetchMessages();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return {
    messages,
    fetchMessages,
    sendMessage,
  };
});
