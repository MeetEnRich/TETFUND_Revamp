// Contractor Dashboard Logic

document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth(['Contractor', 'Beneficiary'])) return;

    const name = sessionStorage.getItem('tetfund_name');
    if(document.getElementById('user-greeting')) {
        document.getElementById('user-greeting').innerText = `Dashboard: ${name}`;
    }

    loadActiveTendersDropdown();
    
    const urlParams = new URLSearchParams(window.location.search);
    const tenderId = urlParams.get('tender');
    if (tenderId) {
        window.preselectedTenderId = tenderId;
    }
});

function switchView(viewId) {
    document.getElementById('view-submit-bid').classList.add('hidden');
    document.getElementById('view-history').classList.add('hidden');
    
    document.getElementById('nav-submit-bid').className = 'p-3 text-gray-600 hover:bg-gray-50 font-semibold rounded';
    document.getElementById('nav-history').className = 'p-3 text-gray-600 hover:bg-gray-50 font-semibold rounded';
    
    document.getElementById(`view-${viewId}`).classList.remove('hidden');
    document.getElementById(`nav-${viewId}`).className = 'p-3 bg-[#eaf5e1] text-[#449B01] font-semibold rounded';

    if (viewId === 'history') {
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
    const tbody = document.getElementById('history-tbody');
    try {
        const subs = await apiFetch('/submissions/mine');
        
        if (subs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-gray-500">No submissions found.</td></tr>';
            return;
        }

        tbody.innerHTML = subs.map(s => {
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

    } catch (err) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-4 text-center text-red-500">Failed to load history.</td></tr>';
    }
}
