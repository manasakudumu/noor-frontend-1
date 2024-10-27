import { fetchy } from "@/utils/fetchy";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useMessagingStore = defineStore("messaging", () => {
  const messages = ref([]);
  const currentConversation = ref([]);

  const fetchMessages = async () => {
    messages.value = await fetchy("/api/messages", "GET");
  };

  const fetchConversation = async (username: string) => {
    currentConversation.value = await fetchy(`/api/messages/conversation/${username}`, "GET");
  };

  const sendMessage = async (recipient: string, messageText: string) => {
    await fetchy("/api/messages/send", "POST", { body: { recipient, messageText } });
    await fetchConversation(recipient);
  };

  return {
    messages,
    currentConversation,
    fetchMessages,
    fetchConversation,
    sendMessage,
  };
});
