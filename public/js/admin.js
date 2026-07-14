// Admin Dashboard Logic

let adminSubsList = [];
let adminSubsPage = 1;
const adminSubsRowsPerPage = 8;

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth(['Administrator'])) return;
    loadStats();

    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.querySelector('.app-layout').classList.toggle('sidebar-collapsed');
        });
    }
});

function switchAdminView(viewId) {
    document.querySelectorAll('main div[id^="view-"]').forEach(div => div.classList.add('hidden'));
    document.querySelectorAll('aside nav a').forEach(a => {
        if(a.id !== 'nav-logout') {
            a.classList.remove('active');
        }
    });
    
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    
    const activeNav = document.getElementById(`nav-${viewId}`);
    if(activeNav) activeNav.classList.add('active');

    // Update dynamic content header title
    const titles = {
        overview: 'System Overview',
        tenders: 'Publish Invitation to Tender (ITT)',
        submissions: 'Contractor Submissions Review',
        news: 'Publish News / Update'
    };
    const titleEl = document.getElementById('content-header-title');
    if (titleEl && titles[viewId]) {
        titleEl.innerText = titles[viewId];
    }

    if (viewId === 'overview') loadStats();
    if (viewId === 'submissions') loadSubmissions();
    if (viewId === 'tenders') loadAdminTenders();
    if (viewId === 'news') loadAdminNews();
}

async function loadStats() {
    try {
        const stats = await apiFetch('/admin/stats');
        document.getElementById('stat-subs').innerText = stats.totalSubmissions;
        document.getElementById('stat-tenders').innerText = stats.activeTenders;
        document.getElementById('stat-users').innerText = stats.registeredContractors;

        // Load recent submissions preview
        const subs = await apiFetch('/admin/submissions');
        const overviewSubsTbody = document.getElementById('overview-subs-tbody');
        if (overviewSubsTbody) {
            if (subs.length === 0) {
                overviewSubsTbody.innerHTML = '<tr><td colspan="3" class="p-3 text-center text-gray-500 text-sm">No recent submissions.</td></tr>';
            } else {
                overviewSubsTbody.innerHTML = subs.slice(0, 5).map(s => {
                    let badgeColor = 'bg-blue-100 text-blue-800';
                    if (s.Status === 'Under Evaluation') badgeColor = 'bg-yellow-100 text-yellow-800';
                    if (s.Status === 'Approved') badgeColor = 'bg-green-100 text-green-800';
                    if (s.Status === 'Rejected') badgeColor = 'bg-red-100 text-red-800';

                    return `
                        <tr>
                            <td class="p-3 font-semibold text-sm">${s.FullName}</td>
                            <td class="p-3 text-xs line-clamp-1" style="max-width: 150px;">${s.TenderTitle}</td>
                            <td class="p-3"><span class="px-2 py-0.5 text-xs font-bold rounded-full ${badgeColor}">${s.Status}</span></td>
                        </tr>
                    `;
                }).join('');
            }
        }

        // Load latest tenders preview
        const tenders = await apiFetch('/tenders?status=Active');
        const overviewTendersList = document.getElementById('overview-tenders-list');
        if (overviewTendersList) {
            if (tenders.length === 0) {
                overviewTendersList.innerHTML = '<div class="text-gray-500 py-3 text-sm text-center">No active tenders found.</div>';
            } else {
                overviewTendersList.innerHTML = tenders.slice(0, 3).map(t => `
                    <div class="flex justify-between items-center p-3 rounded border border-gray-100 bg-gray-50 text-sm">
                        <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 70%;">
                            <strong>${t.Title}</strong>
                            <div class="text-xs text-gray-500">${t.Category}</div>
                        </div>
                        <span class="text-xs text-red-600 font-semibold">${new Date(t.ClosingDate).toLocaleDateString()}</span>
                    </div>
                `).join('');
            }
        }
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
        loadAdminTenders();
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
        loadAdminNews();
    } catch (err) {
        // error handled
    }
}

async function loadSubmissions() {
    try {
        adminSubsList = await apiFetch('/admin/submissions');
        adminSubsPage = 1; // Reset page
        renderAdminSubmissions();
    } catch (err) {
        document.getElementById('admin-subs-tbody').innerHTML = '<tr><td colspan="6" class="p-4 text-center text-red-500">Failed to load submissions.</td></tr>';
    }
}

function renderAdminSubmissions() {
    const tbody = document.getElementById('admin-subs-tbody');
    const pagination = document.getElementById('admin-subs-pagination');
    if (!tbody) return;

    if (adminSubsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="p-4 text-center text-gray-500">No submissions found.</td></tr>';
        if (pagination) pagination.innerHTML = '';
        return;
    }

    const start = (adminSubsPage - 1) * adminSubsRowsPerPage;
    const end = start + adminSubsRowsPerPage;
    const paginatedSubs = adminSubsList.slice(start, end);

    tbody.innerHTML = paginatedSubs.map(s => {
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

    renderAdminSubsPagination();
}

function renderAdminSubsPagination() {
    const pagination = document.getElementById('admin-subs-pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(adminSubsList.length / adminSubsRowsPerPage);
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    const startIdx = (adminSubsPage - 1) * adminSubsRowsPerPage + 1;
    const endIdx = Math.min(adminSubsPage * adminSubsRowsPerPage, adminSubsList.length);

    pagination.innerHTML = `
        <span class="text-sm text-gray-500 font-medium">
            Showing <strong>${startIdx}</strong> to <strong>${endIdx}</strong> of <strong>${adminSubsList.length}</strong> submissions
        </span>
        <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm" onclick="setAdminSubsPage(${adminSubsPage - 1})" ${adminSubsPage === 1 ? 'disabled' : ''}>&larr; Prev</button>
            <span class="flex items-center text-sm font-semibold px-2">Page ${adminSubsPage} of ${totalPages}</span>
            <button class="btn btn-ghost btn-sm" onclick="setAdminSubsPage(${adminSubsPage + 1})" ${adminSubsPage === totalPages ? 'disabled' : ''}>Next &rarr;</button>
        </div>
    `;
}

function setAdminSubsPage(page) {
    adminSubsPage = page;
    renderAdminSubmissions();
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
        
        // Update list status locally to maintain current page view
        const subItem = adminSubsList.find(s => s.SubmissionID === subId);
        if (subItem) subItem.Status = status;
        renderAdminSubmissions();
    } catch (err) {
        renderAdminSubmissions(); // reset select on error
    }
}

async function loadAdminTenders() {
    const tbody = document.getElementById('admin-tenders-list');
    if (!tbody) return;
    try {
        const tenders = await apiFetch('/tenders');
        if (tenders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="p-3 text-center text-gray-500 text-sm">No tenders published yet.</td></tr>';
            return;
        }
        tbody.innerHTML = tenders.map(t => {
            let statusColor = 'bg-green-100 text-green-800';
            if (t.Status === 'Draft') statusColor = 'bg-gray-100 text-gray-800';
            if (t.Status === 'Closed') statusColor = 'bg-red-100 text-red-800';

            return `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 font-semibold text-sm">${t.Title}</td>
                <td class="p-3 text-sm">${t.Category}</td>
                <td class="p-3"><span class="px-2 py-0.5 text-xs font-bold rounded-full ${statusColor}">${t.Status}</span></td>
                <td class="p-3 text-center">
                    <button class="btn btn-danger btn-xs" onclick="deleteTender(${t.TenderID})">Delete</button>
                </td>
            </tr>
        `}).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="4" class="p-3 text-center text-red-500">Failed to load tenders.</td></tr>';
    }
}

async function deleteTender(id) {
    if (!confirm('Are you sure you want to delete this tender and all its associated contractor submissions? This action cannot be undone.')) return;
    try {
        await apiFetch(`/admin/tenders/${id}`, { method: 'DELETE' });
        showToast('Tender deleted successfully', 'success');
        loadAdminTenders();
        loadStats();
    } catch (err) {
        // error handled
    }
}

async function loadAdminNews() {
    const tbody = document.getElementById('admin-news-list');
    if (!tbody) return;
    try {
        const news = await apiFetch('/news');
        if (news.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="p-3 text-center text-gray-500 text-sm">No news articles published yet.</td></tr>';
            return;
        }
        tbody.innerHTML = news.map(n => `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 font-semibold text-sm">${n.Title}</td>
                <td class="p-3 text-sm text-gray-500">${new Date(n.DatePosted).toLocaleDateString()}</td>
                <td class="p-3 text-center">
                    <button class="btn btn-danger btn-xs" onclick="deleteNews(${n.NewsID})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="3" class="p-3 text-center text-red-500">Failed to load news.</td></tr>';
    }
}

async function deleteNews(id) {
    if (!confirm('Are you sure you want to delete this news article?')) return;
    try {
        await apiFetch(`/admin/news/${id}`, { method: 'DELETE' });
        showToast('News article deleted successfully', 'success');
        loadAdminNews();
    } catch (err) {
        // error handled
    }
}
