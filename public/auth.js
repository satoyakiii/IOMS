// public/auth.js
// Управление отображением логина/регистрации, logout, проверка роли
async function getCurrentUser() {
  try {
    const res = await fetch('/api/auth/me', { cache: 'no-store' });
    if (!res.ok) return null;
    const user = await res.json();
    return user || null;
  } catch (e) {
    console.error('getCurrentUser error', e);
    return null;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

async function updateAuthUI() {
  const container = document.getElementById('auth-links');
  if (!container) return;

  const user = await getCurrentUser();

  // Clear
  container.innerHTML = '';

  if (user) {
    // Logged in
    const ordersLink = document.createElement('a');
    ordersLink.href = '/orders';
    ordersLink.className = 'nav-link';
    ordersLink.textContent = 'My Orders';

    const emailSpan = document.createElement('span');
    emailSpan.id = 'user-email';
    emailSpan.className = 'nav-user';
    emailSpan.innerHTML = escapeHtml(user.email || user.name || 'User');

    // admin badge
    const badge = document.createElement('span');
    if (user.role === 'admin') {
      badge.className = 'role-badge';
      badge.textContent = ' admin';
      badge.style.marginLeft = '8px';
      badge.style.fontWeight = '700';
      badge.style.color = '#fff';
      badge.style.background = '#ef4444';
      badge.style.padding = '2px 6px';
      badge.style.borderRadius = '6px';
      badge.style.fontSize = '0.75rem';
    }

    const logoutBtn = document.createElement('button');
    logoutBtn.id = 'logout-btn';
    logoutBtn.className = 'btn nav-logout';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    });

    container.appendChild(ordersLink);
    container.appendChild(emailSpan);
    if (user.role === 'admin') container.appendChild(badge);
    container.appendChild(logoutBtn);

    // Store global currentUser for other scripts
    window.currentUser = user;
    document.body.classList.toggle('is-logged-in', true);
  } else {
    // Not logged in
    const loginA = document.createElement('a');
    loginA.href = '/login';
    loginA.className = 'nav-link';
    loginA.id = 'login-link';
    loginA.textContent = 'Login';

    const regA = document.createElement('a');
    regA.href = '/register';
    regA.className = 'nav-link';
    regA.id = 'register-link';
    regA.textContent = 'Register';

    container.appendChild(loginA);
    container.appendChild(regA);

    window.currentUser = null;
    document.body.classList.toggle('is-logged-in', false);
  }

  // Allow other scripts to react
  if (typeof window.onAuthUpdated === 'function') window.onAuthUpdated(window.currentUser);
}

// initialize on load
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
});
