<script setup>
import { ref, watch, defineEmits } from 'vue'

const props = defineProps({
  msg: String,
  formData: Object,
})

const emit = defineEmits(['submitForm', 'closeForm'])

const name = ref('')
const flv = ref('')
const description = ref('')

// Watch for edit data
watch(() => props.formData, (newData) => {
  if (newData) {
    name.value = newData.name
    flv.value = newData.floor
    description.value = newData.description
  } else {
    name.value = ''
    flv.value = ''
    description.value = ''
  }
}, { immediate: true })

const handleSubmit = () => {
  emit('submitForm', {
    name: name.value,
    floor: flv.value,
    description: description.value,
  })
}
</script>

<template>
  <div>
    <h2>{{ msg }}</h2>
    <form @submit.prevent="handleSubmit">
      <label for="name">Name:</label>
      <input id="name" v-model="name" type="text" required />

      <label for="flv">Floor LV:</label>
      <input id="flv" v-model="flv" type="text" required />

      <label for="description">Description:</label>
      <input id="description" v-model="description" type="text" required />

      <button type="submit">Submit</button>
      <button type="button" @click="emit('closeForm')">Cancel</button>
    </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
}

label {
  margin-top: 1rem;
}

input {
  padding: 0.5rem;
  font-size: 1rem;
  margin-top: 0.25rem;
}

button {
  margin-top: 1.2rem;
  padding: 0.6rem;
  font-size: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button[type="button"] {
  background-color: #ccc;
  color: black;
}

button:hover {
  background-color: #369e6f;
}
</style>
