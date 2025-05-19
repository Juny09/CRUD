<template>
  <div :class="theme">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="brand">My Landing Page</div>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/product">Products</router-link>
        <router-link to="/catalog">Catalog</router-link>
        <router-link to="/form">About Us</router-link>
        <router-link to="/dashboard">Dashboard</router-link>
        <button @click="toggleTheme" class="toggle-btn">
          {{ theme === 'dark' ? '🌞 Light' : '🌙 Dark' }}
        </button>
      </div>
    </nav>
    <!-- Routed Content -->
    <main class="content">
      <router-view />
    </main>
  </div>

</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const theme = ref('light')
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

const router = useRouter()
const goToForm = () => {
  router.push('/form')
}
</script>

<style scoped>
/* Theme styles */
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

/* Hero Section */
.hero {
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(135deg, #0077ff, #00c2ff);
  color: white;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.hero-content p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
}

.cta-btn {
  background-color: #fff;
  color: #0077ff;
  font-weight: bold;
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: background 0.3s;
}

.cta-btn:hover {
  background-color: #e6f0ff;
}

/* Social Proof */
.social-proof {
  text-align: center;
  margin: 3rem 0;
  font-size: 1.1rem;
}

.social-proof img {
  margin-top: 1rem;
  max-width: 300px;
}

/* Testimonials */
.testimonials {
  background-color: #f2f2f2;
  padding: 3rem 2rem;
  text-align: center;
}

.dark .testimonials {
  background-color: #1e1e1e;
}

.testimonials h2 {
  margin-bottom: 2rem;
}

.testimonial-list {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.testimonial {
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  max-width: 300px;
  text-align: left;
}

.dark .testimonial {
  background: #2a2a2a;
  color: #f1f1f1;
}

.testimonial p {
  font-style: italic;
  margin-bottom: 1rem;
}

/* Main content */
.content {
  padding: 2rem;
}
</style>
