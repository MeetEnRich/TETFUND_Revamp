// Auth Logic
async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const btn = e.target.querySelector('button[type="submit"]');

    try {
        btn.disabled = true;
        btn.innerText = 'Authenticating...';

        const data = await apiFetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        sessionStorage.setItem('tetfund_token', data.token);
        sessionStorage.setItem('tetfund_role', data.role);
        sessionStorage.setItem('tetfund_name', data.name);

        showToast('Login successful!');
        
        if (data.role === 'Administrator') {
            window.location.href = '/admin.html';
        } else {
            window.location.href = '/dashboard.html';
        }
    } catch (err) {
        // Toast handled in apiFetch
    } finally {
        btn.disabled = false;
        btn.innerText = 'Sign In';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const fullName = document.getElementById('reg-fullname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const role = document.getElementById('reg-role').value;
    const btn = e.target.querySelector('button[type="submit"]');

    try {
        btn.disabled = true;
        btn.innerText = 'Registering...';

        await apiFetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, password, role })
        });

        showToast('Registration successful! Please log in.');
        document.getElementById('register-form').reset();
        switchTab('login');
    } catch (err) {
        // Toast handled in apiFetch
    } finally {
        btn.disabled = false;
        btn.innerText = 'Register';
    }
}
