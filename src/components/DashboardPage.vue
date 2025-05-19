<template>
  <div class="dashboard">
    <div class="header">
      <h1 class="page-title">📋 Entry Dashboard</h1>
    </div>

    <div class="toolbar">
      <button class="btn btn-primary" @click="startAdd">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 5v14M5 12h14"/>
        </svg>
        Add Entry
      </button>

      <div class="controls">
        <!-- Search Input -->
        <div class="control-group">
          <input type="text" v-model="searchQuery" placeholder="Search..." class="search-input">
        </div>

        <!-- Floor Filter -->
        <div class="control-group">
          <select v-model="selectedFloorLv" class="select-input">
            <option value="">All Floors</option>
            <option v-for="level in floorLevels" :key="level" :value="level">Floor {{ level }}</option>
          </select>
        </div>

        <!-- Date Filter -->
        <div class="control-group">
          <input type="date" v-model="selectedDate" class="date-input">
        </div>

        <!-- Clear Filters Button -->
        <button 
          class="btn btn-secondary" 
          @click="clearFilters"
          :disabled="!hasActiveFilters"
        >
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
          Clear Filters
        </button>
      </div>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('id')" :class="{ active: sortKey === 'id' }">
              <span>No</span>
              <span v-if="sortKey === 'id'" class="sort-icon">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('name')" :class="{ active: sortKey === 'name' }">
              <span>Name</span>
              <span v-if="sortKey === 'name'" class="sort-icon">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('floor')" :class="{ active: sortKey === 'floor' }">
              <span>Floor</span>
              <span v-if="sortKey === 'floor'" class="sort-icon">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('description')" :class="{ active: sortKey === 'description' }">
              <span>Description</span>
              <span v-if="sortKey === 'description'" class="sort-icon">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th @click="sortBy('created_at')" :class="{ active: sortKey === 'created_at' }">
              <span>Date</span>
              <span v-if="sortKey === 'created_at'" class="sort-icon">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredEntries.length === 0">
            <td colspan="6" class="empty-state">
              <div class="empty-content">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1.5">
                  <path d="M3 3h18v18H3zM21 9H3M21 15H3"/>
                </svg>
                <p>No entries found</p>
              </div>
            </td>
          </tr>
          <tr v-for="(entry, index) in filteredEntries" :key="entry.id">
            <td>{{ index + 1 }}</td>
            <td>{{ entry.name }}</td>
            <td>{{ entry.floor }}</td>
            <td>{{ entry.description }}</td>
            <td>{{ formatDate(entry.created_at) }}</td>
            <td>
              <div class="action-buttons">
                <button @click="editEntry(entry)" class="btn-icon" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
                <button @click="deleteEntry(index)" class="btn-icon danger" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

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

// Add this computed property to check if any filters are active
const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== '' || 
    selectedFloorLv.value !== '' || 
    selectedDate.value !== '' ||
    sortKey.value !== ''
  );
});

// Add this method to clear all filters and sorting
const clearFilters = () => {
  searchQuery.value = '';
  selectedFloorLv.value = '';
  selectedDate.value = '';
  sortKey.value = '';
  sortOrder.value = 'asc';
};
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2rem;
  justify-content: space-between;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: none;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.control-group {
  position: relative;
}

.search-input,
.select-input,
.date-input {
  padding: 0.625rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background-color: white;
}

.search-input {
  min-width: 250px;
  padding-left: 2.5rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239ca3af'%3E%3Ccircle cx='11' cy='11' r='8'%3E%3C/circle%3E%3Cpath d='M21 21l-4.35-4.35'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: 1rem center;
  background-size: 1rem;
}

.search-input:focus,
.select-input:focus,
.date-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: #f9fafb;
}

th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease;
}

th:hover {
  background-color: #f3f4f6;
}

th.active {
  color: #3b82f6;
}

.sort-icon {
  margin-left: 0.5rem;
}

td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 0.875rem;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: #f9fafb;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
}

.btn-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background-color: #f3f4f6;
  transform: translateY(-1px);
}

.btn-icon.danger:hover {
  background-color: #fee2e2;
  border-color: #fee2e2;
  color: #dc2626;
}

.empty-state {
  padding: 3rem;
  text-align: center;
}

.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-state p {
  color: #6b7280;
  font-size: 1rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(4px);
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  animation: modalFadeIn 0.3s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .controls {
    flex-direction: column;
  }
  
  .search-input,
  .select-input,
  .date-input {
    width: 100%;
  }
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary:disabled:hover {
  background-color: #f3f4f6;
}

/* Adjust controls spacing to accommodate new button */
.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

/* Make sure controls take full width on mobile */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .btn-secondary {
    width: 100%;
  }
}
</style>