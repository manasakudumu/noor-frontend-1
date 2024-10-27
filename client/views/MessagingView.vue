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
  <main>
    <h1>Your Messages</h1>
    <MessageListComponent :conversations="conversations" />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 1em;
}
</style>
