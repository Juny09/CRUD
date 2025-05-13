<template>
  <div class="dashboard">
    <div class="header">
      <h1 class="page-title">📋 Entry Dashboard</h1>
    </div>

    <!-- Add Button -->
    <div class="button-container">
      <button @click="startAdd">Add Entry</button>
    </div>

    <!-- Search and Sort Controls -->
<!-- Add Date Filter in the Controls Section -->
<div class="controls">
  <!-- Search -->
  <div class="control-group">
    <label for="search">Search:</label>
    <input type="text" id="search" v-model="searchQuery" placeholder="Search by name or floor..." />
  </div>

  <!-- Floor Filter -->
  <div class="control-group">
    <label for="floorFilter">Floor:</label>
    <select v-model="selectedFloorLv" id="floorFilter">
      <option value="">All</option>
      <option v-for="level in floorLevels" :key="level" :value="level">{{ level }}</option>
    </select>
  </div>

  <!-- Add Date Range Filter -->
  <!-- <div class="button-container">
    <label for="startDate">Start Date: </label>
    <input type="date" v-model="startDate" id="startDate" />

    <label for="endDate">End Date: </label>
    <input type="date" v-model="endDate" id="endDate" />
  </div> -->

  <!-- Date Filter -->
  <div class="control-group">
    <label for="selectedDate">Date:</label>
    <input type="date" v-model="selectedDate" id="selectedDate" />
  </div>
</div>

    <!-- Entries Table -->
    <table>
      <thead>
        <tr>
          <th @click="sortBy('id')">No</th>
          <th @click="sortBy('name')">
            Name
            <span v-if="sortKey === 'name'">{{ sortOrder === 'asc' ? '⬆️' : '⬇️' }}</span>
          </th>
          <th @click="sortBy('floor')">Floor LV</th>
          <th @click="sortBy('description')">Description</th>
          <th @click="sortBy('created_at')">Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="filteredEntries.length === 0">
          <td colspan="6">No entries found for the selected criteria.</td>
        </tr>
        <tr v-for="(entry, index) in filteredEntries" :key="entry.id">
          <td>{{ index + 1 }}</td>
          <td>{{ entry.name }}</td>
          <td>{{ entry.floor }}</td>
          <td>{{ entry.description }}</td>
          <td>{{ formatDate(entry.created_at) }}</td>
          <td>
          <div class="action-buttons">
            <button @click="editEntry(entry)">Edit</button>
            <button @click="deleteEntry(index)">Delete</button>
          </div>
        </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Overlay -->
    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-content">
        <FormPage
          msg="Entry Form"
          :formData="selectedEntry"
          @submitForm="handleFormSubmit"
          @closeForm="closeForm"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed,ref, onMounted } from 'vue'
import { supabase } from '@/supabase.js' // adjust path if needed
import FormPage from './FormPage.vue'

const entries = ref([])
const showForm = ref(false)
const selectedEntry = ref(null)
const searchQuery = ref('')
const floorLevels = ref([])
const selectedFloorLv = ref('')
const sortKey = ref('')
const sortOrder = ref('asc') // 'asc' or 'desc'
// const startDate = ref('')
// const endDate = ref('')
const selectedDate = ref('')

const filteredEntries = computed(() => {
  let filtered = entries.value

  if (selectedFloorLv.value !== '') {
    filtered = filtered.filter(e => Number(e.floor) === Number(selectedFloorLv.value))
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(e =>
      e.name.toLowerCase().includes(q) ||
      String(e.floor).includes(q)
    )
  }

  if (selectedDate.value) {
    const selected = new Date(selectedDate.value).toISOString().split('T')[0]
    filtered = filtered.filter(e => {
      const entryDate = new Date(e.created_at).toISOString().split('T')[0]
      return entryDate === selected
    })
  }

  if (sortKey.value) {
    filtered = [...filtered].sort((a, b) => {
      const aVal = a[sortKey.value]
      const bVal = b[sortKey.value]

      if (typeof aVal === 'string') {
        return sortOrder.value === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal
    })
  }

  return filtered
})


const sortBy = (key) => {
  if (sortKey.value === key) {
    // toggle order
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString() // e.g., "5/9/2025" or "09/05/2025" depending on locale
}

// Fetch entries from Supabase
const fetchEntries = async () => {
  const { data, error } = await supabase.from('entries').select('*')
  if (error) {
    console.error('Error fetching entries:', error.message)
  } else {
    entries.value = data
  }

  // Fetch distinct floor_lv values from Supabase
  const { data: levels, error: levelError } = await supabase
    .from('entries')
    .select('floor', { distinct: true })
  
  if (levelError) {
    console.error('Error fetching floor levels:', levelError.message)
  } else {
    // Extract and sort unique floor levels numerically
    const uniqueLevels = [...new Set(levels.map(l => Number(l.floor)))].sort((a, b) => a - b)
    floorLevels.value = uniqueLevels
  }
}

onMounted(fetchEntries)

const startAdd = () => {
  selectedEntry.value = null
  showForm.value = true
}

const editEntry = (entry) => {
  selectedEntry.value = { ...entry }
  showForm.value = true
}

const closeForm = () => {
  showForm.value = false
  selectedEntry.value = null
}

const handleFormSubmit = async (data) => {
  if (selectedEntry.value) {
    // Update
    const { error } = await supabase
      .from('entries')
      .update(data)
      .eq('id', selectedEntry.value.id)

    if (error) {
      console.error('Update failed:', error.message)
    }
  } else {
    // Add new
    const { error } = await supabase.from('entries').insert([data])
    if (error) {
      console.error('Insert failed:', error.message)
    }
  }

  closeForm()
  await fetchEntries()
}


const deleteEntry = async (index) => {
  const entry = entries.value[index]
  if (confirm('Are you sure you want to delete this entry?')) {
    const { error } = await supabase.from('entries').delete().eq('id', entry.id)
    if (error) {
      console.error('Delete failed:', error.message)
    } else {
      await fetchEntries()
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}

button {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #369e6f;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 0.75rem;
  border: 1px solid #ccc;
  text-align: center;
}

th {
  background-color: #f0f0f0;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(8px); /* Blurred background */
  background-color: rgba(0, 0, 0, 0.4); /* Dark overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  min-width: 300px;
  max-width: 500px;
  width: 90%;
}

.header {
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.button-container {
  text-align: center;
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: 'Arial', sans-serif;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 1.5rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  min-width: 150px;
}

.control-group label {
  font-weight: bold;
  margin-bottom: 0.3rem;
  font-size: 0.9rem;
}

.controls input,
.controls select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap; /* Optional: Allows wrapping if too narrow */
}

input[type="date"],
input[type="text"],
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
