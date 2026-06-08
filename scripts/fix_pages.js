const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const publicDir = path.join(__dirname, '../public');

// --- Fix index.html Mobile Portal Button ---
const indexHtmlPath = path.join(publicDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const $index = cheerio.load(indexHtml);
if ($index('#landingNav .btn-group').html() && !$index('#landingNav .btn-group').html().includes('Portal Login')) {
    $index('#landingNav .btn-group').prepend('<a href="/auth.html" class="flex w-fit items-center rounded-md bg-[#449B01] px-10 py-4 text-center text-sm text-white duration-700 ease-in-out hover:-translate-y-[1px] md:mr-0 font-bold">Portal Login</a>');
    
    // Also inject the proper hamburger script if it doesn't already toggle 'open' on landingNav
    if (!indexHtml.includes("landingNav.classList.toggle('open')")) {
        $index('body').append(`
        <script>
            document.addEventListener('DOMContentLoaded', function () {
                // Ensure jQuery isn't fighting us
                $('#navbutton').off('click');
                var wrapperMenu = document.querySelector('.wrapper-menu');
                var landingNav = document.querySelector('#landingNav');
                if (wrapperMenu && landingNav) {
                    // Override any previous click listeners by replacing the element
                    var newWrapper = wrapperMenu.cloneNode(true);
                    wrapperMenu.parentNode.replaceChild(newWrapper, wrapperMenu);
                    
                    newWrapper.addEventListener('click', function () {
                        newWrapper.classList.toggle('open');
                        landingNav.classList.toggle('hidden');
                        landingNav.classList.toggle('open');
                    });
                }
            });
        </script>
        `);
    }
    
    fs.writeFileSync(indexHtmlPath, $index.html());
}

// --- Fix Generated Pages (auth, dashboard, admin) ---
const contactHtml = fs.readFileSync(path.join(__dirname, '../clone/tetfund.gov.ng/contact.html'), 'utf8');
const $contact = cheerio.load(contactHtml);

const headHtml = $contact('head').html();
let navHtml = $contact('nav').prop('outerHTML'); // ONLY the <nav> block
let landingNavHtml = $contact('#landingNav').prop('outerHTML'); // The mobile menu block!
const footerHtml = $contact('footer').prop('outerHTML'); // ONLY the <footer> block

// Get the logo SVG from navHtml
const logoHtml = $contact('nav a').first().html() || '<img src="/assets/images/tetfund.jpg" alt="TETFund Logo" class="h-10">';

// Combine them into a single header wrapper
let fullNavHtml = navHtml + '\n' + landingNavHtml;

// Add Portal button to Desktop Nav AND Mobile Nav
const $nav = cheerio.load(fullNavHtml, null, false);
$nav('nav').find('.container').first().append('<a href="/auth.html" class="bg-[#449B01] text-white px-6 py-2 rounded font-bold ml-4 whitespace-nowrap hidden lg:block hover:bg-[#357a01] transition z-[1001]">Portal Login</a>');
$nav('#landingNav .btn-group').prepend('<a href="/auth.html" class="flex w-fit items-center rounded-md bg-[#449B01] px-10 py-4 text-center text-sm text-white duration-700 ease-in-out hover:-translate-y-[1px] md:mr-0 font-bold">Portal Login</a>');
const upgradedNavHtml = $nav.html();

// Hamburger menu script
const mobileScript = `
<script>
    document.addEventListener('DOMContentLoaded', function () {
        var wrapperMenu = document.querySelector('.wrapper-menu');
        var landingNav = document.querySelector('#landingNav');

        if (wrapperMenu && landingNav) {
            // Replace to strip old listeners
            var newWrapper = wrapperMenu.cloneNode(true);
            wrapperMenu.parentNode.replaceChild(newWrapper, wrapperMenu);
            
            newWrapper.addEventListener('click', function () {
                newWrapper.classList.toggle('open');
                landingNav.classList.toggle('hidden');
                landingNav.classList.toggle('open'); // CRITICAL FOR CSS!
            });
        }
        
        // Handle desktop portals dropdown
        var portalsDropdown = document.querySelector('#portalsDropdown');
        var portalsDropdownMenu = document.querySelector('#portalsDropdownMenu');
        if (portalsDropdown) {
            portalsDropdown.addEventListener('click', function() {
                portalsDropdownMenu.classList.toggle('hidden');
            });
        }
        
        // Handle mobile portals dropdown
        var mobilePortalsDropdown = document.querySelector('#mobilePortalsDropdown');
        var mobilePortalsDropdownMenu = document.querySelector('#mobilePortalsDropdownMenu');
        if (mobilePortalsDropdown) {
            mobilePortalsDropdown.addEventListener('click', function() {
                mobilePortalsDropdownMenu.classList.toggle('hidden');
            });
        }
    });
</script>
`;

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
        <main class="flex-grow container mx-auto px-4 pb-8" style="padding-top: 110px;">
            ${mainContent}
        </main>
        ${footerHtml}
    </div>
    <script src="/js/utils.js"></script>
    ${mobileScript}
    ${scripts}
</body>
</html>`;
}

// Create a totally standalone page specifically for Admin without the main site headers/footers
function createAdminPage(title, mainContent, scripts = '') {
    const logoHtmlMobile = logoHtml.replace(/pattern0/g, 'pattern0_mobile').replace(/image0_622_209/g, 'image0_622_209_mobile');

    const adminMobileHeader = `
    <!-- Mobile Header -->
    <header class="mobile-header bg-white shadow-sm py-4 px-6 flex justify-between items-center border-b-2 border-[#449B01] z-[1000] sticky top-0">
        <div class="flex items-center">
            <a href="/index.html" class="flex w-20 items-center">${logoHtmlMobile}</a>
            <span class="ml-4 font-bold text-lg text-[#449B01] border-l-2 pl-4 border-gray-200">Admin</span>
        </div>
        <div class="wrapper-menu-admin cursor-pointer flex flex-col justify-between" style="height: 16px; width: 24px;">
            <div class="w-full transition-all duration-300 transform origin-right admin-line-start" style="height: 2px; background-color: #1a1a1a;"></div>
            <div class="w-full transition-all duration-300 admin-line-mid" style="height: 2px; background-color: #1a1a1a;"></div>
            <div class="w-full transition-all duration-300 transform origin-left admin-line-end" style="height: 2px; background-color: #1a1a1a;"></div>
        </div>
    </header>

    <!-- Mobile Dropdown -->
    <div id="adminMobileNav" class="hidden fixed inset-0 top-[74px] bg-white z-[999] flex flex-col p-6 gap-6 overflow-y-auto">
        <a href="#overview" onclick="switchAdminView('overview'); toggleAdminMobileMenu();" class="text-lg font-bold border-b pb-2 text-gray-800">Overview</a>
        <a href="#tenders" onclick="switchAdminView('tenders'); toggleAdminMobileMenu();" class="text-lg font-bold border-b pb-2 text-gray-800">Manage Tenders</a>
        <a href="#submissions" onclick="switchAdminView('submissions'); toggleAdminMobileMenu();" class="text-lg font-bold border-b pb-2 text-gray-800">Submissions Review</a>
        <a href="#news" onclick="switchAdminView('news'); toggleAdminMobileMenu();" class="text-lg font-bold border-b pb-2 text-gray-800">Publish News</a>
        <a href="#" onclick="logout()" class="text-lg font-bold text-red-500 mt-2">Logout</a>
        <a href="/index.html" class="text-base font-bold text-gray-500 mt-auto border-t pt-4 flex items-center gap-2">&larr; Back to Main Site</a>
    </div>
    `;

    const adminSidenav = `
    <!-- Desktop Sidenav -->
    <aside class="desktop-sidenav w-64 flex-col h-screen sticky top-0 shadow-lg text-white" style="background-color: #1a1a1a;">
        <div class="p-6 border-b border-gray-800 flex flex-col items-center gap-4 bg-white">
            <a href="/index.html" class="flex w-32 items-center justify-center">${logoHtml}</a>
            <span class="font-bold text-lg text-[#449B01] w-full text-center">Admin Portal</span>
        </div>
        <nav class="flex-1 p-4 flex flex-col gap-2 overflow-y-auto">
            <a href="#overview" onclick="switchAdminView('overview')" class="p-3 font-semibold rounded" style="background-color: #333333; color: white;" id="nav-overview">Overview</a>
            <a href="#tenders" onclick="switchAdminView('tenders')" class="p-3 font-semibold rounded hover-admin-nav" style="color: #cccccc;" id="nav-tenders">Manage Tenders</a>
            <a href="#submissions" onclick="switchAdminView('submissions')" class="p-3 font-semibold rounded hover-admin-nav" style="color: #cccccc;" id="nav-submissions">Submissions Review</a>
            <a href="#news" onclick="switchAdminView('news')" class="p-3 font-semibold rounded hover-admin-nav" style="color: #cccccc;" id="nav-news">Publish News</a>
            <a href="#" onclick="logout()" class="p-3 font-semibold rounded hover-admin-nav" style="color: #f87171; margin-top: 1rem;" id="nav-logout">Logout</a>
        </nav>
        <div class="p-4 border-t border-gray-800">
            <a href="/index.html" class="text-sm font-semibold text-gray-400 hover:text-white transition flex items-center gap-2">
                &larr; Back to Main Site
            </a>
        </div>
    </aside>
    `;

    const adminPageScripts = `
    <style>
        @media (max-width: 767px) {
            .desktop-sidenav { display: none !important; }
            .mobile-header { display: flex !important; }
            .admin-main-wrapper { flex-direction: column !important; }
            main { height: auto !important; overflow-y: visible !important; }
        }
        @media (min-width: 768px) {
            .desktop-sidenav { display: flex !important; }
            .mobile-header { display: none !important; }
            .admin-main-wrapper { flex-direction: row !important; }
        }
    </style>
    <script>
        function toggleAdminMobileMenu() {
            const menu = document.getElementById('adminMobileNav');
            const wrapper = document.querySelector('.wrapper-menu-admin');
            const start = document.querySelector('.admin-line-start');
            const mid = document.querySelector('.admin-line-mid');
            const end = document.querySelector('.admin-line-end');

            menu.classList.toggle('hidden');
            wrapper.classList.toggle('open');
            
            if (wrapper.classList.contains('open')) {
                start.style.transform = 'rotate(-45deg) translate(-2px, 6px)';
                mid.style.opacity = '0';
                end.style.transform = 'rotate(45deg) translate(-2px, -6px)';
            } else {
                start.style.transform = 'none';
                mid.style.opacity = '1';
                end.style.transform = 'none';
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const wrapperMenuAdmin = document.querySelector('.wrapper-menu-admin');
            if (wrapperMenuAdmin) {
                wrapperMenuAdmin.addEventListener('click', toggleAdminMobileMenu);
            }
        });
    </script>
    `;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    ${headHtml}
    <title>${title} | TETFund Admin</title>
</head>
<body class="font-inter w-full bg-[#f6f6f6]">
    <div class="admin-main-wrapper min-h-screen w-full flex">
        ${adminMobileHeader}
        ${adminSidenav}
        <main class="flex-1 p-4 md:p-8 h-screen overflow-y-auto">
            <div class="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-100 min-h-full">
                ${mainContent}
            </div>
        </main>
    </div>
    <script src="/js/utils.js"></script>
    ${scripts}
    ${adminPageScripts}
</body>
</html>`;
}


// Auth Page
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

// Contractor Dashboard
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
            <div style="overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch;">
                <table class="w-full text-left" style="min-width: 600px; width: 100%; border-collapse: collapse;">
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

// Admin Dashboard Content (without the aside, just the views)
const adminContent = `
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
            <h2 class="text-2xl font-bold mb-6 text-gray-800">Contractor Submissions</h2>
            <div class="w-full bg-white shadow-sm sm:rounded-lg" style="overflow-x: auto; max-width: 100%; -webkit-overflow-scrolling: touch;">
                <table class="w-full text-sm text-left text-gray-500" style="min-width: 800px; width: 100%; border-collapse: collapse;">
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
`;

// Update script as well to match new inline styles
const adminScript = `
<style>
.hover-admin-nav:hover { background-color: #333333; color: white !important; }
</style>
<script src="/js/admin.js"></script>
<script>
    function switchAdminView(viewId) {
        document.querySelectorAll('main > div > div').forEach(div => div.classList.add('hidden'));
        document.querySelectorAll('aside nav a').forEach(a => {
            if(a.id !== 'nav-logout') {
                a.style.backgroundColor = 'transparent';
                a.style.color = '#cccccc';
                a.classList.add('hover-admin-nav');
            }
        });
        
        document.getElementById('view-' + viewId).classList.remove('hidden');
        
        const activeNav = document.getElementById('nav-' + viewId);
        if(activeNav) {
            activeNav.style.backgroundColor = '#333333';
            activeNav.style.color = 'white';
            activeNav.classList.remove('hover-admin-nav');
        }

        if (viewId === 'overview') loadStats();
        if (viewId === 'submissions') loadSubmissions();
    }
</script>
`;
// Notice I'm calling createAdminPage here instead of createPage!
fs.writeFileSync(path.join(publicDir, 'admin.html'), createAdminPage('System Admin', adminContent, adminScript));

console.log('Pages fixed!');
