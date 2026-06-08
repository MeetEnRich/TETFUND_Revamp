const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const publicDir = path.join(__dirname, '../public');

// 1. Read contact.html to extract the layout (head, nav, footer)
const contactHtml = fs.readFileSync(path.join(publicDir, 'contact.html'), 'utf8');
const $contact = cheerio.load(contactHtml);

const headHtml = $contact('head').html();
const navHtml = $contact('nav').parent().html(); // Sometimes nav is wrapped
const footerHtml = $contact('footer').parent().html();

// Add Portal button to Nav
const $nav = cheerio.load(navHtml);
$nav('nav').find('.container').first().append('<a href="/auth.html" class="bg-[#449B01] text-white px-6 py-2 rounded font-bold ml-4 whitespace-nowrap hidden lg:block hover:bg-[#357a01] transition">Portal Login</a>');
const upgradedNavHtml = $nav.html();

// Create base template wrapper
function createPage(title, mainContent, scripts = '') {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    ${headHtml}
    <title>${title} | TETFund</title>
</head>
<body class="font-inter w-full bg-[#f6f6f6]">
    <div class="min-h-screen w-full flex flex-col">
        ${upgradedNavHtml}
        <main class="flex-grow container mx-auto px-4 py-8 lg:py-16">
            ${mainContent}
        </main>
        ${footerHtml}
    </div>
    <script src="/js/utils.js"></script>
    ${scripts}
</body>
</html>`;
}

// 2. Create Auth Page
const authContent = `
<div class="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 mt-10">
    <div class="flex border-b mb-6">
        <button id="tab-login" class="flex-1 py-3 text-center font-bold text-[#449B01] border-b-2 border-[#449B01]" onclick="switchTab('login')">Login</button>
        <button id="tab-register" class="flex-1 py-3 text-center font-semibold text-gray-500 border-b-2 border-transparent hover:text-gray-700" onclick="switchTab('register')">Register</button>
    </div>

    <form id="login-form" onsubmit="handleLogin(event)">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back</h2>
        <div class="mb-4">
            <label class="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
            <input type="email" id="login-email" class="w-full p-3 border border-gray-300 rounded focus:border-[#449B01] focus:ring-1 focus:ring-[#449B01] outline-none" required>
        </div>
        <div class="mb-6">
            <label class="block text-sm font-semibold mb-2 text-gray-700">Password</label>
            <input type="password" id="login-password" class="w-full p-3 border border-gray-300 rounded focus:border-[#449B01] focus:ring-1 focus:ring-[#449B01] outline-none" required>
        </div>
        <button type="submit" class="w-full bg-[#449B01] hover:bg-[#357a01] text-white font-bold py-3 rounded transition">Sign In</button>
    </form>

    <form id="register-form" onsubmit="handleRegister(event)" class="hidden">
        <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
        <div class="mb-4">
            <label class="block text-sm font-semibold mb-2 text-gray-700">Company / Beneficiary Name</label>
            <input type="text" id="reg-fullname" class="w-full p-3 border border-gray-300 rounded focus:border-[#449B01]" required>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
            <input type="email" id="reg-email" class="w-full p-3 border border-gray-300 rounded focus:border-[#449B01]" required>
        </div>
        <div class="mb-4">
            <label class="block text-sm font-semibold mb-2 text-gray-700">Password</label>
            <input type="password" id="reg-password" class="w-full p-3 border border-gray-300 rounded focus:border-[#449B01]" required minlength="6">
        </div>
        <div class="mb-6">
            <label class="block text-sm font-semibold mb-2 text-gray-700">Account Type</label>
            <select id="reg-role" class="w-full p-3 border border-gray-300 rounded focus:border-[#449B01]">
                <option value="Contractor">Contractor (Bidder)</option>
                <option value="Beneficiary">Beneficiary Institution</option>
            </select>
        </div>
        <button type="submit" class="w-full bg-[#449B01] hover:bg-[#357a01] text-white font-bold py-3 rounded transition">Register</button>
    </form>
</div>
<script>
function switchTab(tab) {
    document.getElementById('login-form').classList.toggle('hidden', tab !== 'login');
    document.getElementById('register-form').classList.toggle('hidden', tab !== 'register');
    document.getElementById('tab-login').className = tab === 'login' ? 'flex-1 py-3 text-center font-bold text-[#449B01] border-b-2 border-[#449B01]' : 'flex-1 py-3 text-center font-semibold text-gray-500 border-b-2 border-transparent hover:text-gray-700';
    document.getElementById('tab-register').className = tab === 'register' ? 'flex-1 py-3 text-center font-bold text-[#449B01] border-b-2 border-[#449B01]' : 'flex-1 py-3 text-center font-semibold text-gray-500 border-b-2 border-transparent hover:text-gray-700';
}
</script>
`;
fs.writeFileSync(path.join(publicDir, 'auth.html'), createPage('Authentication', authContent, '<script src="/js/auth.js"></script>'));

// 3. Create Contractor Dashboard
const dashboardContent = `
<div class="flex flex-col md:flex-row gap-8">
    <aside class="w-full md:w-64 bg-white p-4 rounded-xl shadow-sm border border-gray-100 h-fit">
        <h3 class="font-bold text-lg mb-4 text-gray-800" id="user-greeting">Dashboard</h3>
        <nav class="flex flex-col gap-2">
            <a href="#submit-bid" onclick="switchView('submit-bid')" class="p-3 bg-[#eaf5e1] text-[#449B01] font-semibold rounded" id="nav-submit-bid">Submit E-Bid</a>
            <a href="#history" onclick="switchView('history')" class="p-3 text-gray-600 hover:bg-gray-50 font-semibold rounded" id="nav-history">My Submissions</a>
            <a href="#" onclick="logout()" class="p-3 text-red-600 hover:bg-red-50 font-semibold rounded mt-4">Logout</a>
        </nav>
    </aside>

    <div class="flex-1">
        <div id="view-submit-bid" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-2xl font-bold mb-6 border-b pb-4">E-Bid Submission Portal</h2>
            
            <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                <h4 class="font-bold text-yellow-800">Mandatory Requirement (Wrong Box Prevention)</h4>
                <p class="text-yellow-700 text-sm mt-1">To prevent disqualification, you must explicitly select the correct procurement category matching your bid document.</p>
            </div>

            <form id="bid-form" onsubmit="handleBidSubmit(event)">
                <div class="mb-4">
                    <label class="block font-semibold mb-2">Select Active Tender</label>
                    <select id="bid-tender" class="w-full p-3 border rounded bg-gray-50" required><option value="">Loading...</option></select>
                </div>
                
                <div class="mb-4">
                    <label class="block font-semibold mb-2">Procurement Category <span class="text-red-500">*</span></label>
                    <select id="bid-category" class="w-full p-3 border-2 border-[#449B01] rounded bg-white" required>
                        <option value="" disabled selected>-- Select the exact category --</option>
                        <option value="Works">Works</option>
                        <option value="Goods">Goods</option>
                        <option value="Services">Services</option>
                    </select>
                </div>

                <div class="mb-6">
                    <label class="block font-semibold mb-2">Upload Bid Document (PDF/ZIP)</label>
                    <input type="file" id="bid-file" class="w-full p-3 border rounded bg-white" accept=".pdf,.zip" required>
                </div>

                <button type="submit" class="bg-[#449B01] text-white font-bold py-3 px-6 rounded hover:bg-[#357a01] transition">Submit Secure E-Bid</button>
            </form>
        </div>

        <div id="view-history" class="hidden bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 class="text-2xl font-bold mb-6 border-b pb-4">My Submissions</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 border-b">
                            <th class="p-3 text-sm font-semibold text-gray-600">ID</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Tender Title</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Category</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Timestamp</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Status</th>
                        </tr>
                    </thead>
                    <tbody id="history-tbody">
                        <tr><td colspan="5" class="p-4 text-center text-gray-500">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
`;
fs.writeFileSync(path.join(publicDir, 'dashboard.html'), createPage('Contractor Dashboard', dashboardContent, '<script src="/js/dashboard.js"></script>'));

// 4. Create Admin Dashboard
const adminContent = `
<div class="flex flex-col md:flex-row gap-8">
    <aside class="w-full md:w-64 bg-gray-900 p-4 rounded-xl shadow-md h-fit text-white">
        <h3 class="font-bold text-lg mb-4 text-[#449B01]" id="admin-greeting">Admin</h3>
        <nav class="flex flex-col gap-2">
            <a href="#overview" onclick="switchAdminView('overview')" class="p-3 bg-gray-800 font-semibold rounded" id="nav-overview">Overview</a>
            <a href="#tenders" onclick="switchAdminView('tenders')" class="p-3 hover:bg-gray-800 font-semibold rounded" id="nav-tenders">Manage Tenders</a>
            <a href="#submissions" onclick="switchAdminView('submissions')" class="p-3 hover:bg-gray-800 font-semibold rounded" id="nav-submissions">Submissions Review</a>
            <a href="#news" onclick="switchAdminView('news')" class="p-3 hover:bg-gray-800 font-semibold rounded" id="nav-news">Publish News</a>
            <a href="#" onclick="logout()" class="p-3 text-red-400 hover:bg-gray-800 font-semibold rounded mt-4">Logout</a>
        </nav>
    </aside>

    <div class="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
        <div id="view-overview">
            <h2 class="text-2xl font-bold mb-6 border-b pb-4">System Overview</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="p-6 border-l-4 border-[#449B01] bg-gray-50 rounded shadow-sm">
                    <p class="text-sm font-bold text-gray-500 uppercase">Total Submissions</p>
                    <h3 class="text-4xl font-bold mt-2" id="stat-subs">--</h3>
                </div>
                <div class="p-6 border-l-4 border-yellow-500 bg-gray-50 rounded shadow-sm">
                    <p class="text-sm font-bold text-gray-500 uppercase">Active Tenders</p>
                    <h3 class="text-4xl font-bold mt-2" id="stat-tenders">--</h3>
                </div>
                <div class="p-6 border-l-4 border-blue-500 bg-gray-50 rounded shadow-sm">
                    <p class="text-sm font-bold text-gray-500 uppercase">Registered Contractors</p>
                    <h3 class="text-4xl font-bold mt-2" id="stat-users">--</h3>
                </div>
            </div>
        </div>

        <div id="view-tenders" class="hidden">
            <h2 class="text-2xl font-bold mb-6 border-b pb-4">Publish Invitation to Tender (ITT)</h2>
            <form id="tender-form" onsubmit="handleTenderSubmit(event)" class="max-w-2xl">
                <div class="mb-4">
                    <label class="block font-semibold mb-2">Tender Title</label>
                    <input type="text" id="t-title" class="w-full p-3 border rounded" required>
                </div>
                <div class="mb-4">
                    <label class="block font-semibold mb-2">Description / Scope</label>
                    <textarea id="t-desc" class="w-full p-3 border rounded" rows="4" required></textarea>
                </div>
                <div class="grid grid-cols-2 gap-4 mb-6">
                    <div>
                        <label class="block font-semibold mb-2">Category</label>
                        <select id="t-cat" class="w-full p-3 border rounded" required>
                            <option value="Works">Works</option><option value="Goods">Goods</option><option value="Services">Services</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-semibold mb-2">Status</label>
                        <select id="t-status" class="w-full p-3 border rounded" required>
                            <option value="Draft">Draft</option><option value="Active">Active</option><option value="Closed">Closed</option>
                        </select>
                    </div>
                    <div>
                        <label class="block font-semibold mb-2">Published Date</label>
                        <input type="date" id="t-pub" class="w-full p-3 border rounded" required>
                    </div>
                    <div>
                        <label class="block font-semibold mb-2">Closing Date & Time</label>
                        <input type="datetime-local" id="t-close" class="w-full p-3 border rounded" required>
                    </div>
                </div>
                <button type="submit" class="bg-[#449B01] text-white font-bold py-3 px-6 rounded hover:bg-[#357a01]">Save Tender</button>
            </form>
        </div>

        <div id="view-submissions" class="hidden">
            <h2 class="text-2xl font-bold mb-6 border-b pb-4">Contractor Submissions</h2>
            <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-gray-50 border-b">
                            <th class="p-3 text-sm font-semibold text-gray-600">ID</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Contractor</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Tender Title</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Doc</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Status</th>
                            <th class="p-3 text-sm font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody id="admin-subs-tbody">
                        <tr><td colspan="6" class="p-4 text-center">Loading...</td></tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div id="view-news" class="hidden">
            <h2 class="text-2xl font-bold mb-6 border-b pb-4">Publish News</h2>
            <form id="news-form" onsubmit="handleNewsSubmit(event)" class="max-w-2xl">
                <div class="mb-4">
                    <label class="block font-semibold mb-2">Headline</label>
                    <input type="text" id="n-title" class="w-full p-3 border rounded" required>
                </div>
                <div class="mb-4">
                    <label class="block font-semibold mb-2">Image URL (Optional)</label>
                    <input type="url" id="n-img" class="w-full p-3 border rounded" placeholder="https://...">
                </div>
                <div class="mb-6">
                    <label class="block font-semibold mb-2">Content</label>
                    <textarea id="n-content" class="w-full p-3 border rounded" rows="8" required></textarea>
                </div>
                <button type="submit" class="bg-[#449B01] text-white font-bold py-3 px-6 rounded hover:bg-[#357a01]">Publish News</button>
            </form>
        </div>
    </div>
</div>
`;
fs.writeFileSync(path.join(publicDir, 'admin.html'), createPage('Admin Dashboard', adminContent, '<script src="/js/admin.js"></script>'));

// 5. Update index.html to add Portal Login button and the dynamic Tenders/News section
const indexHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf8');
const $index = cheerio.load(indexHtml);

// Add portal login button to native header
$index('nav').first().find('.container').first().append('<a href="/auth.html" class="bg-[#449B01] text-white px-6 py-2 rounded font-bold ml-4 whitespace-nowrap hidden lg:block hover:bg-[#357a01] transition z-50">Portal Login</a>');

// Inject our Dynamic section at the end of <main>
const dynamicSection = `
<section class="container mx-auto px-4 py-16" id="dynamic-portal-section">
    <div class="flex flex-col lg:flex-row gap-8">
        <div class="flex-1">
            <div class="flex justify-between items-end border-b pb-4 mb-6">
                <h2 class="text-3xl font-bold text-gray-800">Active Tenders</h2>
                <select id="tender-category-filter" class="p-2 border rounded border-gray-300">
                    <option value="">All Categories</option><option value="Works">Works</option><option value="Goods">Goods</option><option value="Services">Services</option>
                </select>
            </div>
            <div id="tenders-container" class="grid grid-cols-1 gap-6">
                <div class="text-center p-8 bg-gray-50 rounded">Loading active tenders...</div>
            </div>
        </div>
        
        <div class="flex-1">
            <h2 class="text-3xl font-bold text-gray-800 border-b pb-4 mb-6">Latest News</h2>
            <div id="news-container" class="grid grid-cols-1 gap-6">
                <div class="text-center p-8 bg-gray-50 rounded">Loading news...</div>
            </div>
        </div>
    </div>
</section>
`;

$index('main').append(dynamicSection);
$index('body').append('<script src="/js/utils.js"></script><script src="/js/main.js"></script>');
fs.writeFileSync(path.join(publicDir, 'index.html'), $index.html());

console.log('Pivot completed successfully!');
