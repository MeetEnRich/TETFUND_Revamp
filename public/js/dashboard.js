// Contractor Dashboard Logic

let dashboardSubsList = [];
let dashboardSubsPage = 1;
const dashboardSubsRowsPerPage = 8;

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth(['Contractor', 'Beneficiary'])) return;

    const name = sessionStorage.getItem('tetfund_name');
    const role = sessionStorage.getItem('tetfund_role');

    if(document.getElementById('user-greeting')) {
        document.getElementById('user-greeting').innerText = role === 'Beneficiary' ? `Institution: ${name}` : `Dashboard: ${name}`;
    }

    if (role === 'Beneficiary') {
        // Change sidebar links dynamically
        const navContainer = document.querySelector('.sidebar-nav');
        if (navContainer) {
            navContainer.innerHTML = `
                <a href="#beneficiary-sso" id="nav-beneficiary-sso" class="active" onclick="switchView('beneficiary-sso')" data-tooltip="SSO Gateway">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    <span>SSO Gateway</span>
                </a>
                <a href="#history" id="nav-history" onclick="switchView('history')" data-tooltip="Announcements">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                    </svg>
                    <span>Announcements</span>
                </a>
                <a href="#" onclick="logout(); return false;" class="nav-danger" data-tooltip="Logout">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                </a>
            `;
        }

        // Change mobile menu links dynamically
        const mobileMenu = document.getElementById('dashboard-mobile-menu');
        if (mobileMenu) {
            mobileMenu.innerHTML = `
                <a href="#beneficiary-sso" onclick="switchView('beneficiary-sso'); toggleDashboardMenu();">SSO Gateway</a>
                <a href="#history" onclick="switchView('history'); toggleDashboardMenu();">Announcements</a>
                <a href="#" onclick="logout(); toggleDashboardMenu();" class="nav-danger">Logout</a>
                <a href="/index.html" class="nav-back">&larr; Back to Main Site</a>
            `;
        }

        // Replace announcements tab content
        const historyView = document.getElementById('view-history');
        if (historyView) {
            historyView.innerHTML = `
                <div class="flex flex-col gap-4">
                    <div class="card p-5" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem !important;">
                        <span class="text-xs text-primary font-bold uppercase tracking-wide mb-1 block">July 4, 2026</span>
                        <h4 class="text-base font-bold mb-2">2026 Institutional Intervention Allocations Released</h4>
                        <p class="text-gray-600 text-sm">TETFund has officially released the guidelines for the 2026 academic staff training and development grant applications. Beneficiary representatives should verify allocation values via the TERAS portal.</p>
                    </div>
                    <div class="card p-5" style="background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem !important;">
                        <span class="text-xs text-primary font-bold uppercase tracking-wide mb-1 block">June 28, 2026</span>
                        <h4 class="text-base font-bold mb-2">BIMS Enrollment Deadline Extension</h4>
                        <p class="text-gray-600 text-sm">The Biometric enrollment exercise for beneficiary universities in Zone A has been extended by two weeks. Identity managers are advised to complete faculty registrations.</p>
                    </div>
                </div>
            `;
        }

        // Force initial view
        setTimeout(() => switchView('beneficiary-sso'), 50);
    } else {
        loadActiveTendersDropdown();
        
        const urlParams = new URLSearchParams(window.location.search);
        const tenderId = urlParams.get('tender');
        if (tenderId) {
            window.preselectedTenderId = tenderId;
        }
    }

    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.querySelector('.app-layout').classList.toggle('sidebar-collapsed');
        });
    }
});

function switchView(viewId) {
    const views = ['submit-bid', 'history', 'beneficiary-sso'];
    views.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) el.classList.add('hidden');
        const nav = document.getElementById(`nav-${v}`);
        if (nav) nav.classList.remove('active');
    });
    
    const targetView = document.getElementById(`view-${viewId}`);
    if (targetView) targetView.classList.remove('hidden');
    const targetNav = document.getElementById(`nav-${viewId}`);
    if (targetNav) targetNav.classList.add('active');

    // Update dynamic content header title
    const titles = {
        'submit-bid': 'E-Bid Submission Portal',
        'history': sessionStorage.getItem('tetfund_role') === 'Beneficiary' ? 'Institutional Announcements' : 'My E-Bid Submissions',
        'beneficiary-sso': 'SSO Gateway Portal'
    };
    const titleEl = document.getElementById('content-header-title');
    if (titleEl && titles[viewId]) {
        titleEl.innerText = titles[viewId];
    }

    if (viewId === 'history' && sessionStorage.getItem('tetfund_role') !== 'Beneficiary') {
        loadHistory();
    }
}

async function loadActiveTendersDropdown() {
    const select = document.getElementById('bid-tender');
    if(!select) return;
    try {
        const tenders = await apiFetch('/tenders?status=Active');
        if (tenders.length === 0) {
            select.innerHTML = '<option value="">No active tenders available</option>';
            return;
        }

        select.innerHTML = '<option value="" disabled selected>-- Select a Tender --</option>' + 
            tenders.map(t => `<option value="${t.TenderID}">${t.Title} (${t.Category})</option>`).join('');

        if (window.preselectedTenderId) {
            select.value = window.preselectedTenderId;
        }
    } catch (err) {
        select.innerHTML = '<option value="">Failed to load tenders</option>';
    }
}

async function handleBidSubmit(e) {
    e.preventDefault();
    const tenderID = document.getElementById('bid-tender').value;
    const category = document.getElementById('bid-category').value;
    const fileInput = document.getElementById('bid-file');
    const btn = e.target.querySelector('button[type="submit"]');

    if (!tenderID || !category || !fileInput.files[0]) {
        showToast('Please fill all required fields.', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('tenderID', tenderID);
    formData.append('category', category);
    formData.append('bidDocument', fileInput.files[0]);

    try {
        btn.disabled = true;
        btn.innerText = 'Uploading Securely...';
        const data = await apiFetch('/submissions', { method: 'POST', body: formData });
        showToast(`Success! Your receipt ID is #${data.submissionID}`, 'success');
        e.target.reset();
        setTimeout(() => switchView('history'), 2000);
    } catch (err) {
        // Error shown by apiFetch
    } finally {
        btn.disabled = false;
        btn.innerText = 'Submit Secure E-Bid';
    }
}

async function loadHistory() {
    try {
        dashboardSubsList = await apiFetch('/submissions/mine');
        dashboardSubsPage = 1; // Reset page
        renderDashboardHistory();
    } catch (err) {
        document.getElementById('history-tbody').innerHTML = '<tr><td colspan="5" class="p-4 text-center text-red-500">Failed to load history.</td></tr>';
    }
}

function renderDashboardHistory() {
    const tbody = document.getElementById('history-tbody');
    const pagination = document.getElementById('dashboard-history-pagination');
    if (!tbody) return;

    if (dashboardSubsList.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-gray-500">No submissions found.</td></tr>';
        if (pagination) pagination.innerHTML = '';
        return;
    }

    const start = (dashboardSubsPage - 1) * dashboardSubsRowsPerPage;
    const end = start + dashboardSubsRowsPerPage;
    const paginatedSubs = dashboardSubsList.slice(start, end);

    tbody.innerHTML = paginatedSubs.map(s => {
        let badgeColor = 'bg-blue-100 text-blue-800';
        if (s.Status === 'Under Evaluation') badgeColor = 'bg-yellow-100 text-yellow-800';
        if (s.Status === 'Approved') badgeColor = 'bg-green-100 text-green-800';
        if (s.Status === 'Rejected') badgeColor = 'bg-red-100 text-red-800';

        return `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-3 font-bold">#${s.SubmissionID}</td>
            <td class="p-3">${s.TenderTitle}</td>
            <td class="p-3">${s.Category}</td>
            <td class="p-3 text-sm">${new Date(s.Timestamp).toLocaleString()}</td>
            <td class="p-3"><span class="px-2 py-1 text-xs font-bold rounded-full ${badgeColor}">${s.Status}</span></td>
        </tr>
    `}).join('');

    renderDashboardHistoryPagination();
}

function renderDashboardHistoryPagination() {
    const pagination = document.getElementById('dashboard-history-pagination');
    if (!pagination) return;

    const totalPages = Math.ceil(dashboardSubsList.length / dashboardSubsRowsPerPage);
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    const startIdx = (dashboardSubsPage - 1) * dashboardSubsRowsPerPage + 1;
    const endIdx = Math.min(dashboardSubsPage * dashboardSubsRowsPerPage, dashboardSubsList.length);

    pagination.innerHTML = `
        <span class="text-sm text-gray-500 font-medium">
            Showing <strong>${startIdx}</strong> to <strong>${endIdx}</strong> of <strong>${dashboardSubsList.length}</strong> submissions
        </span>
        <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm" onclick="setDashboardHistoryPage(${dashboardSubsPage - 1})" ${dashboardSubsPage === 1 ? 'disabled' : ''}>&larr; Prev</button>
            <span class="flex items-center text-sm font-semibold px-2">Page ${dashboardSubsPage} of ${totalPages}</span>
            <button class="btn btn-ghost btn-sm" onclick="setDashboardHistoryPage(${dashboardSubsPage + 1})" ${dashboardSubsPage === totalPages ? 'disabled' : ''}>Next &rarr;</button>
        </div>
    `;
}

function setDashboardHistoryPage(page) {
    dashboardSubsPage = page;
    renderDashboardHistory();
}
