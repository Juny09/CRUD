<template>
  <div class="product-page">
    <div class="product-container">
      <div class="product-image">
        <img :src="product.image" :alt="product.name" />
      </div>
      <div class="product-details">
        <h1 class="product-title">{{ product.name }}</h1>
        <p class="product-price">${{ product.price.toFixed(2) }}</p>
        <div class="product-description">
          <p>{{ product.description }}</p>
        </div>
        <div class="product-actions">
          <div class="quantity-selector">
            <button @click="decreaseQuantity" :disabled="quantity <= 1">-</button>
            <span>{{ quantity }}</span>
            <button @click="increaseQuantity">+</button>
          </div>
          <button class="add-to-cart-btn" @click="addToCart">Add to Cart</button>
        </div>
      </div>
    </div>
    
    <div class="product-tabs">
      <div class="tabs-header">
        <button 
          v-for="tab in tabs" 
          :key="tab.id" 
          :class="{ active: activeTab === tab.id }"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>
      <div class="tab-content">
        <div v-if="activeTab === 'details'" class="tab-pane">
          <h3>Product Details</h3>
          <ul>
            <li v-for="(detail, index) in product.details" :key="index">
              {{ detail }}
            </li>
          </ul>
        </div>
        <div v-if="activeTab === 'specs'" class="tab-pane">
          <h3>Specifications</h3>
          <table>
            <tr v-for="(spec, key) in product.specifications" :key="key">
              <td>{{ key }}</td>
              <td>{{ spec }}</td>
            </tr>
          </table>
        </div>
        <div v-if="activeTab === 'reviews'" class="tab-pane">
          <h3>Customer Reviews</h3>
          <div v-if="product.reviews && product.reviews.length">
            <div v-for="(review, index) in product.reviews" :key="index" class="review">
              <div class="review-header">
                <span class="review-author">{{ review.author }}</span>
                <span class="review-rating">
                  ★★★★★
                  <span :style="`width: ${review.rating * 20}%`">★★★★★</span>
                </span>
                <span class="review-date">{{ review.date }}</span>
              </div>
              <p class="review-content">{{ review.content }}</p>
            </div>
          </div>
          <div v-else class="no-reviews">
            No reviews yet. Be the first to review this product!
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductPage',
  data() {
    return {
      product: {
        id: 1,
        name: 'Sample Product',
        price: 99.99,
        description: 'This is a sample product description. It provides details about the product features and benefits.',
        image: '/images/sample-product.jpg',
        details: [
          'High-quality materials',
          'Durable construction',
          'Easy to use',
          'Versatile application'
        ],
        specifications: {
          'Dimensions': '10 x 5 x 2 inches',
          'Weight': '1.5 lbs',
          'Color': 'Black',
          'Material': 'Aluminum'
        },
        reviews: [
          {
            author: 'John Doe',
            rating: 4.5,
            date: '2023-05-15',
            content: 'Great product! Works exactly as described.'
          },
          {
            author: 'Jane Smith',
            rating: 5,
            date: '2023-04-22',
            content: 'Excellent quality and fast shipping. Highly recommended!'
          }
        ]
      },
      quantity: 1,
      activeTab: 'details',
      tabs: [
        { id: 'details', name: 'Details' },
        { id: 'specs', name: 'Specifications' },
        { id: 'reviews', name: 'Reviews' }
      ]
    }
  },
  methods: {
    increaseQuantity() {
      this.quantity++;
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    addToCart() {
      // Implement cart functionality here
      alert(`Added ${this.quantity} item(s) to cart`);
      // You would typically dispatch an action to your store here
    }
  }
}
</script>

<style scoped>
.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.product-container {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 40px;
}

.product-image {
  flex: 1;
  min-width: 300px;
}

.product-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.product-details {
  flex: 1;
  min-width: 300px;
}

.product-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.product-price {
  font-size: 22px;
  font-weight: bold;
  color: #e53935;
  margin-bottom: 20px;
}

.product-description {
  margin-bottom: 20px;
  line-height: 1.6;
}

.product-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-selector button {
  width: 30px;
  height: 30px;
  border: 1px solid #ddd;
  background: #f5f5f5;
  cursor: pointer;
  border-radius: 4px;
}

.quantity-selector span {
  min-width: 30px;
  text-align: center;
}

.add-to-cart-btn {
  padding: 12px 24px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.add-to-cart-btn:hover {
  background-color: #388e3c;
}

.product-tabs {
  margin-top: 40px;
}

.tabs-header {
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
}

.tabs-header button {
  padding: 10px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  position: relative;
}

.tabs-header button.active {
  font-weight: bold;
}

.tabs-header button.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4caf50;
}

.tab-content {
  padding: 20px 0;
}

.tab-pane {
  animation: fadeIn 0.3s;
}

.tab-pane h3 {
  margin-bottom: 15px;
}

.tab-pane ul {
  padding-left: 20px;
}

.tab-pane li {
  margin-bottom: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table tr {
  border-bottom: 1px solid #eee;
}

table td {
  padding: 10px;
}

table td:first-child {
  font-weight: bold;
  width: 30%;
}

.review {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.review-author {
  font-weight: bold;
}

.review-rating {
  position: relative;
  color: #ddd;
}

.review-rating span {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  color: #ffc107;
}

.no-reviews {
  font-style: italic;
  color: #666;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .product-container {
    flex-direction: column;
  }
  
  .tabs-header {
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
