<template>
  <div :class="theme">
    <section class="catalog-header">
      <h1>Product Catalog</h1>
      <p>Browse our selection of visitor management solutions</p>
    </section>

    <section class="catalog-filters">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search products..." 
          @input="filterProducts"
        />
      </div>
      <div class="filter-options">
        <select v-model="categoryFilter" @change="filterProducts">
          <option value="">All Categories</option>
          <option value="software">Software</option>
          <option value="hardware">Hardware</option>
          <option value="services">Services</option>
        </select>
        <select v-model="sortOption" @change="filterProducts">
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>
    </section>

    <section class="catalog-products">
      <div v-if="filteredProducts.length === 0" class="no-results">
        <p>No products found matching your criteria.</p>
      </div>
      <div v-else class="product-grid">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="product-card"
        >
          <div class="product-image">
            <img 
              :src="product.image" 
              :alt="product.name"
              @error="handleImageError($event)"
              ref="productImage"
            />
          </div>
          <div class="product-info">
            <h3 class="product-name">{{ product.name }}</h3>
            <p class="product-category">{{ product.category }}</p>
            <p class="product-description">{{ product.description }}</p>
            <p class="product-price">RM {{ product.price.toFixed(2) }}</p>
            <button class="add-to-cart-btn" @click="addToCart(product)">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const theme = ref('light')
const searchQuery = ref('')
const categoryFilter = ref('')
const sortOption = ref('name-asc')
const products = ref([])
const filteredProducts = ref([])

// Sample product data - in a real app, this would come from an API
const sampleProducts = [
  {
    id: 1,
    name: 'Visitor Management System',
    category: 'software',
    description: 'Complete software solution for managing visitors and check-ins.',
    price: 1299.99,
    image: 'C:\\Users\\JUNYUAN\\test\\src\\assets\\images.png'
  },
  {
    id: 2,
    name: 'Check-in Kiosk',
    category: 'hardware',
    description: 'Self-service kiosk for visitor registration.',
    price: 2499.99,
    image: 'C:\\Users\\JUNYUAN\\test\\src\\assets\\images.png'
  },
  {
    id: 3,
    name: 'Access Control Cards',
    category: 'hardware',
    description: 'Pack of 50 RFID access cards for secure entry.',
    price: 199.99,
    image: 'C:\\Users\\JUNYUAN\\test\\src\\assets\\images.png'
  },
  {
    id: 4,
    name: 'Installation Service',
    category: 'services',
    description: 'Professional installation of your visitor management system.',
    price: 599.99,
    image: 'C:\\Users\\JUNYUAN\\test\\src\\assets\\images.png'
  },
  {
    id: 5,
    name: 'Maintenance Plan',
    category: 'services',
    description: 'Annual maintenance and support package.',
    price: 899.99,
    image: 'C:\\Users\\JUNYUAN\\test\\src\\assets\\images.png'
  },
  {
    id: 6,
    name: 'Mobile Check-in App',
    category: 'software',
    description: 'Mobile application for visitor check-ins on the go.',
    price: 499.99,
    image: 'C:\\Users\\JUNYUAN\\test\\src\\assets\\images.png'
  }
]

onMounted(() => {
  // In a real app, you would fetch products from an API
  products.value = sampleProducts
  filteredProducts.value = [...products.value]
})

const filterProducts = () => {
  let result = [...products.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.description.toLowerCase().includes(query)
    )
  }
  
  // Apply category filter
  if (categoryFilter.value) {
    result = result.filter(product => 
      product.category === categoryFilter.value
    )
  }
  
  // Apply sorting
  switch (sortOption.value) {
    case 'name-asc':
      result.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      result.sort((a, b) => b.name.localeCompare(a.name))
      break
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
  }
  
  filteredProducts.value = result
}

const handleImageError = (event) => {
  // Replace broken image with a placeholder
  event.target.src = 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22200%22 height%3D%22200%22 viewBox%3D%220 0 200 200%22%3E%3Crect fill%3D%22%23eeeeee%22 width%3D%22200%22 height%3D%22200%22%2F%3E%3Ctext fill%3D%22%23999999%22 font-family%3D%22sans-serif%22 font-size%3D%2220%22 dy%3D%220.35em%22 text-anchor%3D%22middle%22 x%3D%22100%22 y%3D%22100%22%3ENo Image%3C%2Ftext%3E%3C%2Fsvg%3E'
}

const addToCart = (product) => {
  // In a real app, this would add the product to a cart store
  alert(`Added ${product.name} to cart!`)
}
</script>

<style scoped>
.catalog-header {
  text-align: center;
  margin-bottom: 2rem;
}

.catalog-header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.catalog-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .catalog-filters {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.search-bar input {
  padding: 0.8rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-options select {
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
}

.dark .filter-options select,
.dark .search-bar input {
  background-color: #2a2a2a;
  color: #f1f1f1;
  border-color: #444;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.product-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: white;
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 500px;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.dark .product-card {
  background-color: #2a2a2a;
  color: #f1f1f1;
}

.product-image {
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.product-info {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.product-name {
  margin-top: 0;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 2.8em;
  line-height: 1.4;
}

.product-category {
  color: #666;
  text-transform: capitalize;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.dark .product-category {
  color: #aaa;
}

.product-description {
  margin-bottom: 1rem;
  display: -webkit-box;

  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

.product-price {
  font-weight: bold;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: #0077ff;
  margin-top: auto;
}

.dark .product-price {
  color: #00c2ff;
}

.add-to-cart-btn {
  background-color: #0077ff;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.add-to-cart-btn:hover {
  background-color: #0055cc;
}

.no-results {
  text-align: center;
  padding: 3rem;
  background-color: #f8f9fa;
  border-radius: 10px;
}

.dark .no-results {
  background-color: #2a2a2a;
}
</style>
