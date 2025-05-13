<template>
  <div class="page">
    <h1>Update Info</h1>
    <form @submit.prevent="handleUpdate">
      <label for="info">Update Field:</label>
      <input id="info" v-model="info" type="text" />
      <button type="submit">Update</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const info = ref('')

const handleUpdate = () => {
  alert(`Updated with: ${info.value}`)
}
</script>

<style scoped>
.page {
  padding: 2rem;
}

input, button {
  margin-top: 1rem;
  padding: 0.5rem;
}
</style>
