
let products = [];
let editingProductId = null;
let currentUser = null; // { _id, email, role }

async function apiGet(path) {
  const r = await fetch(path, { credentials: 'same-origin' });
  return r;
}

async function apiJSON(path, opts = {}) {
  opts.credentials = 'same-origin';
  const r = await fetch(path, opts);
  return r;
}


async function checkAuth() {
  try {
    const res = await apiGet('/api/auth/me');
    if (!res.ok) {
      currentUser = null;
      updateUIForUser();
      return null;
    }
    const u = await res.json();
    currentUser = u;
    updateUIForUser();
    return u;
  } catch (e) {
    currentUser = null;
    updateUIForUser();
    return null;
  }
}

function updateUIForUser() {
  const loginLink = document.getElementById('login-link');
  const registerLink = document.getElementById('register-link');
  const ordersLink = document.getElementById('orders-link');
  const userEmail = document.getElementById('user-email');
  const logoutBtn = document.getElementById('logout-btn');
  const apiSection = document.getElementById('api');
  const productFormSection = document.getElementById('product-form-section');
  const ordersSection = document.getElementById('orders-section');
  const ordersPagePossible = document.getElementById('orders-content');

  if (currentUser) {
    if (loginLink) loginLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'none';
    if (ordersLink) ordersLink.style.display = 'inline-block';
    if (userEmail) { userEmail.style.display = 'inline-block'; userEmail.textContent = currentUser.email; }
    if (logoutBtn) { logoutBtn.style.display = 'inline-block'; }

    // admin vs user UI
    if (currentUser.role === 'admin') {
      if (apiSection) apiSection.style.display = 'block';
      if (productFormSection) productFormSection.style.display = 'block';
      if (ordersSection) ordersSection.style.display = 'none'; // admin may not have user orders view
    } else {
      // normal user
      if (apiSection) apiSection.style.display = 'none';
      if (productFormSection) productFormSection.style.display = 'none';
      if (ordersSection) ordersSection.style.display = 'block';
    }
  } else {
    // not logged
    if (loginLink) loginLink.style.display = 'inline-block';
    if (registerLink) registerLink.style.display = 'inline-block';
    if (ordersLink) ordersLink.style.display = 'none';
    if (userEmail) userEmail.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'none';
    if (apiSection) apiSection.style.display = 'none';
    if (productFormSection) productFormSection.style.display = 'none';
    if (ordersSection) ordersSection.style.display = 'none';
  }
}

// logout action
document.addEventListener('click', (e) => {
  const el = e.target;
  if (el && el.id === 'logout-btn') {
    fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
      .then(() => {
        currentUser = null;
        updateUIForUser();
        window.location.href = '/';
      }).catch(()=>{ currentUser = null; updateUIForUser(); window.location.href = '/'; });
  }
});

async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Failed to fetch products');
    products = await res.json();
    renderProductsTable();
  } catch (error) {
    console.error('Error fetching products:', error);
    showError('Failed to load products. Please refresh the page.');
  }
}

async function createProduct(productData) {
  try {
    const res = await apiJSON('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const error = await res.json().catch(()=>({error:'Failed'}));
      throw new Error(error.error || 'Failed to create product');
    }
    const newProduct = await res.json();
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

async function updateProduct(id, productData) {
  try {
    const res = await apiJSON(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    if (!res.ok) {
      const error = await res.json().catch(()=>({error:'Failed'}));
      throw new Error(error.error || 'Failed to update product');
    }
    await fetchProducts();
    showSuccess('Product updated successfully!');
  } catch (error) {
    console.error('Error updating product:', error);
    showError(error.message);
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    const res = await apiJSON(`/api/products/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const error = await res.json().catch(()=>({error:'Failed'}));
      throw new Error(error.error || 'Failed to delete product');
    }
    products = products.filter(p => String(p._id) !== String(id));
    renderProductsTable();
    showSuccess('Product deleted successfully!');
  } catch (error) {
    console.error('Error deleting product:', error);
    showError(error.message);
    throw error;
  }
}

async function fetchOrdersForCurrentUser() {
  if (!currentUser) return;
  try {
    const res = await fetch('/api/orders', { credentials: 'same-origin' });
    if (!res.ok) throw new Error('Failed to fetch orders');
    const body = await res.json();
    const items = body.items || body;
    renderOrders(items);
  } catch (err) {
    console.error('Fetch orders error', err);
    document.getElementById('orders-content').textContent = "Failed to load orders.";
  }
}

function renderOrders(items=[]) {
  const el = document.getElementById('orders-content') || document.getElementById('orders-list');
  if (!el) return;
  if (!items || items.length === 0) {
    el.innerHTML = `<p>You don't have any orders.</p>`;
    return;
  }
  el.innerHTML = `<table class="products-table"><thead><tr><th>Product</th><th>Qty</th><th>Total</th><th>Status</th></tr></thead><tbody>${
    items.map(o => `<tr><td>${escapeHtml(o.productName || o.productId || 'Product')}</td><td>${o.quantity}</td><td>${o.totalPrice || '-'}</td><td>${o.status||'-'}</td></tr>`).join('')
  }</tbody></table>`;
}
function renderProductsTable() {
  const tbody = document.getElementById('products-tbody');
  if (!tbody) return;

  if (!products || products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:2rem;color:#6b7280;">No products found. ${currentUser && currentUser.role==='admin' ? 'Add your first product using the form below.' : 'Please check back later.'}</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(product => {
    const created = product.createdAt ? new Date(product.createdAt).toLocaleDateString() : '-';
    // actions depend on role
    let actions = '';
    if (currentUser && currentUser.role === 'admin') {
      actions = `
        <button class="btn-edit" onclick="startEdit('${product._id}')">Edit</button>
        <button class="btn-delete" onclick="confirmDelete('${product._id}', '${escapeHtml(product.name)}')">Delete</button>
      `;
    } else if (currentUser) {
      // logged user - order button
      actions = `<button class="btn btn-primary" onclick="orderProduct('${product._id}')">Order</button>`;
    } else {
      actions = `<span style="color:#6b7280">Login to order</span>`;
    }

    return `<tr>
      <td>${escapeHtml(product.name)}</td>
      <td>$${Number(product.price).toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td>${created}</td>
      <td>${actions}</td>
    </tr>`;
  }).join('');
}

// editing helpers
function startEdit(id) {
  const product = products.find(p => String(p._id) === String(id));
  if (!product) return;
  editingProductId = id;
  document.getElementById('product-name').value = product.name;
  document.getElementById('product-price').value = product.price;
  document.getElementById('product-quantity').value = product.quantity;
  document.getElementById('form-title').textContent = 'Edit Product';
  document.getElementById('submit-btn').textContent = 'Update Product';
  document.getElementById('cancel-btn').style.display = 'inline-block';
  document.getElementById('product-form-section').scrollIntoView({ behavior: 'smooth' });
}

function cancelEdit() {
  editingProductId = null;
  const form = document.getElementById('product-form');
  if (form) form.reset();
  document.getElementById('form-title').textContent = 'Add New Product';
  document.getElementById('submit-btn').textContent = 'Add Product';
  document.getElementById('cancel-btn').style.display = 'none';
}

function confirmDelete(id, name) {
  if (confirm(`Are you sure you want to delete "${name}"?`)) {
    deleteProduct(id);
  }
}

// order product (simple implementation: POST /api/orders)
async function orderProduct(productId) {
  if (!currentUser) {
    showError('Please login to order');
    return;
  }
  const qty = parseInt(prompt('Enter quantity to order', '1'), 10);
  if (!qty || qty <= 0) return;
  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ productId, quantity: qty, deliveryAddress: '' })
    });
    if (!res.ok) {
      const err = await res.json().catch(()=>({error:'Order failed'}));
      showError(err.error || 'Order failed');
      return;
    }
    const data = await res.json();
    showSuccess('Order placed successfully!');
    // refresh orders
    fetchOrdersForCurrentUser();
  } catch (err) {
    showError('Order failed');
    console.error(err);
  }
}

// form submit handler for product form (admin)
async function handleProductFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('product-name').value.trim();
  const price = Number(document.getElementById('product-price').value);
  const quantity = parseInt(document.getElementById('product-quantity').value, 10);
  if (!name || Number.isNaN(price) || Number.isNaN(quantity)) {
    showError('Please fill valid values');
    return;
  }
  const data = { name, price, quantity };
  try {
    if (editingProductId) {
      await updateProduct(editingProductId, data);
    } else {
      await createProduct(data);
    }
    cancelEdit();
  } catch (err) {}
}

function showSuccess(message) { showNotification(message,'success'); }
function showError(message) { showNotification(message,'error'); }
function showNotification(message, type) {
  const el = document.getElementById('notification');
  if (!el) return;
  el.textContent = message;
  el.className = `notification ${type}`;
  el.style.display = 'block';
  setTimeout(()=> el.style.display = 'none', 4000);
}

function escapeHtml(text='') {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', async () => {
  // attach product form handlers 
  const pform = document.getElementById('product-form');
  if (pform) pform.addEventListener('submit', handleProductFormSubmit);
  const cancelBtn = document.getElementById('cancel-btn');
  if (cancelBtn) cancelBtn.addEventListener('click', cancelEdit);

  // check user and then fetch products/orders
  await checkAuth();
  await fetchProducts();

  // if user logged and non-admin: fetch user orders for orders section
  if (currentUser && currentUser.role !== 'admin') {
    fetchOrdersForCurrentUser();
  }

  // if we are on /orders page (separate file), fetch orders into that page
  if (document.getElementById('orders-content')) {
    await checkAuth();
    if (currentUser) fetchOrdersForCurrentUser();
    else document.getElementById('orders-content').innerText = "Please login to view your orders.";
  }
});
