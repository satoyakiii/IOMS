// public/app.js - Frontend CRUD для управления продуктами

// Глобальные переменные
let products = [];
let editingProductId = null;

// ===== API Functions =====

/**
 * Загрузить все продукты с сервера
 */
async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    if (!response.ok) throw new Error('Failed to fetch products');
    products = await response.json();
    renderProductsTable();
  } catch (error) {
    console.error('Error fetching products:', error);
    showError('Failed to load products. Please refresh the page.');
  }
}

/**
 * Создать новый продукт
 */
async function createProduct(productData) {
  try {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create product');
    }
    
    const newProduct = await response.json();
    products.push(newProduct);
    renderProductsTable();
    showSuccess('Product created successfully!');
    return newProduct;
  } catch (error) {
    console.error('Error creating product:', error);
    showError(error.message);
    throw error;
  }
}

/**
 * Обновить продукт
 */
async function updateProduct(id, productData) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update product');
    }
    
    const updatedProduct = await response.json();
    const index = products.findIndex(p => p._id === id);
    if (index !== -1) {
      products[index] = updatedProduct;
    }
    renderProductsTable();
    showSuccess('Product updated successfully!');
    return updatedProduct;
  } catch (error) {
    console.error('Error updating product:', error);
    showError(error.message);
    throw error;
  }
}

/**
 * Удалить продукт
 */
async function deleteProduct(id) {
  try {
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete product');
    }
    
    products = products.filter(p => p._id !== id);
    renderProductsTable();
    showSuccess('Product deleted successfully!');
  } catch (error) {
    console.error('Error deleting product:', error);
    showError(error.message);
    throw error;
  }
}

// ===== UI Functions =====

/**
 * Отобразить таблицу продуктов
 */
function renderProductsTable() {
  const tbody = document.getElementById('products-tbody');
  
  if (products.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">
          No products found. Add your first product using the form below.
        </td>
      </tr>
    `;
    return;
  }
  
  tbody.innerHTML = products.map(product => `
    <tr>
      <td>${escapeHtml(product.name)}</td>
      <td>$${product.price.toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>${new Date(product.createdAt).toLocaleDateString()}</td>
      <td>
        <button class="btn-edit" onclick="startEdit('${product._id}')">Edit</button>
        <button class="btn-delete" onclick="confirmDelete('${product._id}', '${escapeHtml(product.name)}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

/**
 * Начать редактирование продукта
 */
function startEdit(id) {
  const product = products.find(p => p._id === id);
  if (!product) return;
  
  editingProductId = id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-quantity').value = product.quantity;
  
  document.getElementById('form-title').textContent = 'Edit Product';
  document.getElementById('submit-btn').textContent = 'Update Product';
  document.getElementById('cancel-btn').style.display = 'inline-block';
  
  // Прокрутить к форме
  document.getElementById('product-form-section').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Отменить редактирование
 */
function cancelEdit() {
  editingProductId = null;
  document.getElementById('product-form').reset();
  document.getElementById('form-title').textContent = 'Add New Product';
  document.getElementById('submit-btn').textContent = 'Add Product';
  document.getElementById('cancel-btn').style.display = 'none';
}

/**
 * Подтвердить удаление
 */
function confirmDelete(id, name) {
  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    deleteProduct(id);
  }
}

/**
 * Обработка отправки формы
 */
async function handleSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('product-name').value.trim();
  const price = parseFloat(document.getElementById('product-price').value);
  const quantity = parseInt(document.getElementById('product-quantity').value);
  
  // Валидация на клиенте
  if (!name || price < 0 || quantity < 0) {
    showError('Please fill all fields with valid values');
    return;
  }
  
  const productData = { name, price, quantity };
  
  try {
    if (editingProductId) {
      await updateProduct(editingProductId, productData);
    } else {
      await createProduct(productData);
    }
    cancelEdit();
  } catch (error) {
    // Ошибка уже показана в функциях create/update
  }
}

// ===== Notification Functions =====

function showSuccess(message) {
  showNotification(message, 'success');
}

function showError(message) {
  showNotification(message, 'error');
}

function showNotification(message, type) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 4000);
}

// ===== Utility Functions =====

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== Initialization =====

document.addEventListener('DOMContentLoaded', () => {
  // Загрузить продукты при загрузке страницы
  fetchProducts();
  
  // Привязать обработчик формы
  const form = document.getElementById('product-form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  
  // Привязать кнопку отмены
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', cancelEdit);
  }
});