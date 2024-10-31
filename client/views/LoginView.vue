<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
</script>

<template>
  <main class="auth-container">
    <h1 class="auth-heading">Please login or register!</h1>
    <section class="form-section">
      <LoginForm />
    </section>
    <section class="form-section">
      <RegisterForm />
    </section>
  </main>
</template>

<style scoped>
:root {
  --primary-color: #3498db;
  --accent-color: #16a085;
  --text-color: #2c3e50;
  --background-color: #f8f9fa;
  --form-bg-color: #ffffff;
  --form-border-color: #dfe4ea;
  --font-family: "Playfair Display", serif;
}

.auth-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2em;
  background-color: var(--background-color);
  min-height: 100vh;
  font-family: var(--font-family);
}

.auth-heading {
  font-size: 2.5em;
  color: var(--text-color);
  margin-bottom: 1.5em;
  text-align: center;
}

.form-section {
  background-color: var(--form-bg-color);
  border: 1px solid var(--form-border-color);
  padding: 2em;
  border-radius: 10px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 1.5em;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  font-family: var(--font-family);
}

.form-section:first-of-type {
  margin-bottom: 2em;
}

@media (max-width: 768px) {
  .auth-heading {
    font-size: 2em;
  }
  .form-section {
    padding: 1.5em;
  }
}
</style>
