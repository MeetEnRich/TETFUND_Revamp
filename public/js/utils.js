// Shared UI Utilities

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast ' + (type === 'success' ? 'toast-success' : 'toast-error');
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

async function apiFetch(endpoint, options = {}) {
    const token = sessionStorage.getItem('tetfund_token');
    const headers = { ...options.headers };
    if (token) {
        headers['Authorization'] = 'Bearer ' + token;
    }
    const response = await fetch('/api' + endpoint, { ...options, headers });
    const data = await response.json();
    if (!response.ok) {
        showToast(data.error || 'An error occurred', 'error');
        throw new Error(data.error);
    }
    return data;
}

function checkAuth(allowedRoles) {
    allowedRoles = allowedRoles || [];
    var role = sessionStorage.getItem('tetfund_role');
    if (!role) {
        window.location.href = '/auth.html';
        return false;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        showToast('Unauthorized access', 'error');
        setTimeout(function() { window.location.href = '/index.html'; }, 1500);
        return false;
    }
    return true;
}

function logout() {
    sessionStorage.clear();
    window.location.href = '/index.html';
}

document.addEventListener('DOMContentLoaded', function() {
    var role = sessionStorage.getItem('tetfund_role');
    if (role) {
        document.querySelectorAll('.guest-only').forEach(function(el) { el.classList.add('hidden'); });
        document.querySelectorAll('.auth-required').forEach(function(el) { el.classList.remove('hidden'); });
        var dashLink = document.getElementById('nav-dashboard-link');
        if (dashLink) {
            dashLink.href = role === 'Administrator' ? '/admin.html' : '/dashboard.html';
        }
    }
});
