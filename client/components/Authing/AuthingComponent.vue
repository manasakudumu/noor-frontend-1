<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable unused-imports/no-unused-vars -->
<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const actions = ["Alert", "Monitor", "Post", "Message"];
const allowedActions = ref<string[]>([]);
const error = ref("");

async function fetchAuthorizations() {
  try {
    allowedActions.value = await fetchy("/api/authorize/user/actions", "GET", {});
  } catch (err) {
    error.value = "Failed to fetch actions.";
  }
}

async function toggleAuthorization(action: string) {
  try {
    if (allowedActions.value.includes(action)) {
      await fetchy(`/api/authorize/deny/${action.toLowerCase()}`, "POST", {});
      allowedActions.value = allowedActions.value.filter((a) => a !== action);
    } else {
      await fetchy(`/api/authorize/allow/${action.toLowerCase()}`, "POST", {});
      allowedActions.value.push(action);
    }
  } catch (err) {
    error.value = "Failed to toggle authorization.";
  }
}

onBeforeMount(fetchAuthorizations);
</script>

<template>
  <div class="authorization-toggle">
    <h2>Manage Authorizations</h2>
    <ul>
      <li v-for="action in actions" :key="action">
        <span>{{ action }}</span>
        <input type="checkbox" :checked="allowedActions.includes(action)" @change="toggleAuthorization(action)" />
      </li>
    </ul>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<style scoped>
/* Styles for authorization toggle */
</style>
