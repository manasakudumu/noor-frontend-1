<script setup lang="ts">
import MessageListComponent from "@/components/Message/MessageListComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onMounted, ref } from "vue";

const conversations = ref([]);

async function loadConversations() {
  conversations.value = await fetchy("/api/messages", "GET");
}

onMounted(loadConversations);
</script>

<template>
  <main class="messages-container">
    <h1 class="messages-heading">Your Messages</h1>
    <section class="message-list">
      <MessageListComponent :conversations="conversations" />
    </section>
  </main>
</template>

<style scoped>
:root {
  --primary-color: #3498db;
  --accent-color: #16a085;
  --text-color: #2c3e50;
  --background-color: #f8f9fa;
  --font-family: "Playfair Display", serif;
}

.messages-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background-color: var(--background-color);
  min-height: 100vh;
  font-family: var(--font-family);
}

.messages-heading {
  font-size: 2.5em;
  color: var(--text-color);
  margin-bottom: 1.5em;
  text-align: center;
}

.message-list {
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 10px;
  padding: 1.5em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .messages-heading {
    font-size: 2em;
  }

  .message-list {
    padding: 1em;
  }
}
</style>
