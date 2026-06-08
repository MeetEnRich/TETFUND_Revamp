// Admin Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth(['Administrator'])) return;
    loadStats();
});

function switchAdminView(viewId) {
    document.querySelectorAll('.flex-1 > div').forEach(div => div.classList.add('hidden'));
    document.querySelectorAll('aside nav a').forEach(a => {
        if(a.id !== 'nav-logout') {
            a.className = 'p-3 hover:bg-gray-800 font-semibold rounded';
        }
    });
    
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    
    const activeNav = document.getElementById(`nav-${viewId}`);
    if(activeNav) activeNav.className = 'p-3 bg-gray-800 font-semibold rounded';

    if (viewId === 'overview') loadStats();
    if (viewId === 'submissions') loadSubmissions();
}

async function loadStats() {
    try {
        const stats = await apiFetch('/admin/stats');
        document.getElementById('stat-subs').innerText = stats.totalSubmissions;
        document.getElementById('stat-tenders').innerText = stats.activeTenders;
        document.getElementById('stat-users').innerText = stats.registeredContractors;
    } catch (err) {
        // failed to load stats
    }
}

async function handleTenderSubmit(e) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('t-title').value,
        description: document.getElementById('t-desc').value,
        category: document.getElementById('t-cat').value,
        status: document.getElementById('t-status').value,
        publishedDate: document.getElementById('t-pub').value,
        closingDate: document.getElementById('t-close').value,
    };

    try {
        await apiFetch('/admin/tenders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        showToast('Tender published successfully!', 'success');
        e.target.reset();
        loadStats();
    } catch (err) {
        // error handled
    }
}

async function handleNewsSubmit(e) {
    e.preventDefault();
    const payload = {
        title: document.getElementById('n-title').value,
        content: document.getElementById('n-content').value,
        imagePath: document.getElementById('n-img').value || null
    };

    try {
        await apiFetch('/admin/news', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        showToast('News published successfully!', 'success');
        e.target.reset();
    } catch (err) {
        // error handled
    }
}

async function loadSubmissions() {
    const tbody = document.getElementById('admin-subs-tbody');
    try {
        const subs = await apiFetch('/admin/submissions');
        
        if (subs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">No submissions found.</td></tr>';
            return;
        }

        tbody.innerHTML = subs.map(s => {
            let badgeColor = 'bg-blue-100 text-blue-800';
            if (s.Status === 'Under Evaluation') badgeColor = 'bg-yellow-100 text-yellow-800';
            if (s.Status === 'Approved') badgeColor = 'bg-green-100 text-green-800';
            if (s.Status === 'Rejected') badgeColor = 'bg-red-100 text-red-800';

            return `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 font-bold text-gray-700">#${s.SubmissionID}</td>
                <td class="p-3 font-semibold">${s.FullName}</td>
                <td class="p-3 text-sm">${s.TenderTitle}</td>
                <td class="p-3"><a href="/uploads/${s.FilePath}" target="_blank" class="text-blue-600 hover:underline font-semibold">View Doc</a></td>
                <td class="p-3"><span class="px-2 py-1 text-xs font-bold rounded-full ${badgeColor}">${s.Status}</span></td>
                <td class="p-3">
                    <select class="p-1 border rounded text-sm outline-none" onchange="updateSubmissionStatus(${s.SubmissionID}, this.value)">
                        <option value="" disabled selected>Change...</option>
                        <option value="Under Evaluation">Evaluate</option>
                        <option value="Approved">Approve</option>
                        <option value="Rejected">Reject</option>
                    </select>
                </td>
            </tr>
        `}).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-red-500">Failed to load submissions.</td></tr>';
    }
}

async function updateSubmissionStatus(subId, status) {
    if(!status) return;
    try {
        await apiFetch(`/admin/submissions/${subId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        showToast('Status updated', 'success');
        loadSubmissions();
    } catch (err) {
        loadSubmissions(); // reset select
    }
}
