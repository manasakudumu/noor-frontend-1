<script setup lang="ts">
import { ref } from "vue";
import { useAlertStore } from "@/stores/alert"; // Assuming you have an alert store
import { useRouter } from "vue-router";

const alertStatus = ref(false);
const street = ref("");
const city = ref("");
const state = ref("");
const zipcode = ref("");
const latitude = ref("");
const longitude = ref("");

const router = useRouter();
const { activateAlert, deactivateAlert, updateAlertLocation } = useAlertStore();

async function activateEmergency() {
  await activateAlert({
    street: street.value,
    city: city.value,
    state: state.value,
    zipcode: zipcode.value,
    latitude: parseFloat(latitude.value),
    longitude: parseFloat(longitude.value),
  });
  alertStatus.value = true;
}

async function deactivateEmergency() {
  await deactivateAlert();
  alertStatus.value = false;
}

async function updateLocation() {
  await updateAlertLocation({
    street: street.value,
    city: city.value,
    state: state.value,
    zipcode: zipcode.value,
    latitude: parseFloat(latitude.value),
    longitude: parseFloat(longitude.value),
  });
}
</script>

<template>
  <form class="pure-form pure-form-aligned" @submit.prevent="alertStatus ? deactivateEmergency() : activateEmergency()">
    <h3>{{ alertStatus ? "Deactivate Emergency Alert" : "Activate Emergency Alert" }}</h3>
    <fieldset>
      <div class="pure-control-group">
        <label for="street">Street</label>
        <input v-model="street" type="text" id="street" placeholder="Street" required />
      </div>
      <div class="pure-control-group">
        <label for="city">City</label>
        <input v-model="city" type="text" id="city" placeholder="City" required />
      </div>
      <div class="pure-control-group">
        <label for="state">State</label>
        <input v-model="state" type="text" id="state" placeholder="State" required />
      </div>
      <div class="pure-control-group">
        <label for="zipcode">Zip Code</label>
        <input v-model="zipcode" type="text" id="zipcode" placeholder="Zip Code" required />
      </div>
      <div class="pure-control-group">
        <label for="latitude">Latitude</label>
        <input v-model="latitude" type="text" id="latitude" placeholder="Latitude" required />
      </div>
      <div class="pure-control-group">
        <label for="longitude">Longitude</label>
        <input v-model="longitude" type="text" id="longitude" placeholder="Longitude" required />
      </div>
      <div class="pure-controls">
        <button type="submit" class="pure-button pure-button-primary">
          {{ alertStatus ? "Deactivate Alert" : "Activate Alert" }}
        </button>
        <button type="submit" class="pure-button pure-button-primary">Update Location</button>
      </div>
    </fieldset>
  </form>
</template>

<style scoped>
h3 {
  display: flex;
  justify-content: center;
}
</style>
