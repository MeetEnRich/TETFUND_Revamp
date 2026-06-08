const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const cloneDir = path.join(__dirname, '../clone/tetfund.gov.ng');
const publicDir = path.join(__dirname, '../public');

// Helper to copy directory recursively
function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log('Copying assets and build folders...');
copyDirSync(path.join(cloneDir, 'assets'), path.join(publicDir, 'assets'));
copyDirSync(path.join(cloneDir, 'build'), path.join(publicDir, 'build'));

// 1. Extract the Navigation from the clone
console.log('Extracting navigation from clone...');
const cloneIndexHtml = fs.readFileSync(path.join(cloneDir, 'index.html'), 'utf8');
const $clone = cheerio.load(cloneIndexHtml);
const $nav = $clone('nav').first();

// Premium upgrades to the nav
$nav.attr('style', 'background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(12px); border-bottom: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); ' + ($nav.attr('style') || ''));

// Add our custom buttons to the nav container
const customButtons = `
<div class="flex items-center gap-4 ml-auto pl-4 border-l border-gray-200" style="display: flex; align-items: center; gap: 1rem; margin-left: auto; padding-left: 1rem; border-left: 1px solid #e5e7eb;">
    <a href="/index.html#tenders" style="color: #449B01; font-weight: 600; text-decoration: none;">Live Tenders</a>
    <a href="/auth.html" class="guest-only" style="background: #449B01; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; text-decoration: none;">Login / Register</a>
    <a href="/dashboard.html" id="nav-dashboard-link" class="auth-required hidden" style="background: #449B01; color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 600; text-decoration: none;">Dashboard</a>
    <a href="#" onclick="logout()" class="auth-required hidden" style="color: #6B6B6B; font-weight: 600; text-decoration: none;">Logout</a>
</div>
`;

// Append to the first container inside nav
$nav.find('.container').first().append(customButtons);
const upgradedNavHtml = $clone.html($nav);

// Extract the clone's <head> links (Tailwind, Alpine.js, etc.)
let headLinksHtml = '';
$clone('head link, head script').each((i, el) => {
    headLinksHtml += $clone.html(el) + '\n';
});

// 2. Process Core Files (index, auth, dashboard, admin)
const coreFiles = ['index.html', 'auth.html', 'dashboard.html', 'admin.html'];
for (const file of coreFiles) {
    const filePath = path.join(publicDir, file);
    if (!fs.existsSync(filePath)) continue;
    
    const coreHtml = fs.readFileSync(filePath, 'utf8');
    const $core = cheerio.load(coreHtml);
    
    // Replace header
    $core('header.header').replaceWith(upgradedNavHtml);
    
    // Inject clone head links to ensure Alpine/Tailwind work for the header
    $core('head').append(headLinksHtml);
    
    // Fix paths in header if needed (ensure absolute paths)
    $core('nav img, nav script, nav link').each((i, el) => {
        ['src', 'href'].forEach(attr => {
            const val = $core(el).attr(attr);
            if (val && !val.startsWith('http') && !val.startsWith('/')) {
                $core(el).attr(attr, '/' + val);
            }
        });
    });

    // Make hero section of index.html premium using clone's landing1.webp
    if (file === 'index.html') {
        const hero = $core('main > section').first();
        hero.attr('style', 'background: linear-gradient(rgba(17, 24, 39, 0.85), rgba(68, 155, 1, 0.8)), url("/assets/images/landing1.webp") center/cover; padding: 8rem 0; text-align: center; color: white; box-shadow: inset 0 0 50px rgba(0,0,0,0.5);');
        hero.find('h1').attr('style', 'font-size: 3rem; margin-bottom: 1.5rem; color: white; text-shadow: 0 2px 4px rgba(0,0,0,0.5);');
        hero.find('p').attr('style', 'font-size: 1.25rem; color: #eaf5e1; max-width: 800px; margin: 0 auto 2.5rem; text-shadow: 0 1px 2px rgba(0,0,0,0.5);');
    }

    fs.writeFileSync(filePath, $core.html());
    console.log(`Upgraded core file: ${file}`);
}

// 3. Process Clone Files
const files = fs.readdirSync(cloneDir);
for (const file of files) {
    if (file.endsWith('.html') && file !== 'index.html') {
        const filePath = path.join(cloneDir, file);
        const html = fs.readFileSync(filePath, 'utf8');
        const $page = cheerio.load(html);
        
        // Replace their nav with our upgraded nav
        $page('nav').replaceWith(upgradedNavHtml);
        
        // Fix relative paths (assets/ -> /assets/)
        $page('img, script, link, a').each((i, el) => {
            ['src', 'href'].forEach(attr => {
                const val = $page(el).attr(attr);
                if (val && !val.startsWith('http') && !val.startsWith('/') && !val.startsWith('#') && !val.startsWith('mailto')) {
                    $page(el).attr(attr, '/' + val);
                }
            });
        });

        // Inject our utils and auth state handlers
        $page('body').append('<script src="/js/utils.js"></script>');
        
        fs.writeFileSync(path.join(publicDir, file), $page.html());
        console.log(`Migrated clone page: ${file}`);
    }
}

console.log('Migration complete!');
