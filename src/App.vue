<template>
  <div :class="theme">
    <nav class="navbar">
      <div class="brand">My Landing Page</div>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/form">About Us</router-link>
        <router-link to="/update">Contact Us</router-link>
        <button @click="toggleTheme" class="toggle-btn">
          {{ theme === 'dark' ? '🌞 Light' : '🌙 Dark' }}
        </button>
      </div>
    </nav>

    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
</script>

<style scoped>
/* Base theme styles */
.light {
  background-color: #f8f9fa;
  color: #212529;
}

.dark {
  background-color: #121212;
  color: #ffffff;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: inherit;
  border-bottom: 1px solid #ccc;
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links a {
  margin: 0 1rem;
  text-decoration: none;
  color: inherit;
}

.toggle-btn {
  background: none;
  border: 1px solid currentColor;
  padding: 0.4rem 1rem;
  cursor: pointer;
  border-radius: 5px;
}

/* Main content */
.content {
  padding: 2rem;
}
</style>
