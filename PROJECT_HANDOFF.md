# TETFund Website Revamp — Project Handoff Document

## Project Overview

This is a final year Computer Science project for **Umar, Ya'u Sadiq (2022/CP/CSC/0069)** at the **Federal University of Lafia**. The project proposes and implements a comprehensive revamp of the Tertiary Education Trust Fund (TETFund) website, replacing the current static information portal with a fully interactive, transactional web platform.

**Supervisor corrections have been addressed:**
- Chapters 1–3 fully rewritten from scratch with humanised academic voice
- All AI-generated diagrams replaced with original draw.io files
- Literature review expanded to 15 papers with proper 6-column summary table
- Chapter 3 expanded with data dictionary, pseudocode algorithm, security considerations

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend Runtime | Node.js v20 LTS |
| Web Framework | Express.js v4 |
| Database (Production) | MySQL v8 |
| Database (Development) | SQLite v3 via better-sqlite3 |
| Authentication | JWT (jsonwebtoken) + bcryptjs |
| File Uploads | Multer |
| Email | Nodemailer |
| Frontend | HTML5, CSS3, Vanilla JavaScript (ES6+) |

---

## Project Directory Structure

```
tetfund-revamp/
├── clone/                        ← HTTrack clone of live tetfund.gov.ng (136MB)
│   └── tetfund.gov.ng/           ← Full offline copy of existing site
├── src/
│   ├── app.js                    ← Express app entry point (PORT 3000)
│   ├── config/
│   │   └── db.js                 ← SQLite connection via better-sqlite3
│   ├── middleware/
│   │   └── auth.js               ← JWT authenticate() + requireRole() middleware
│   ├── routes/
│   │   ├── auth.js               ← POST /api/auth/register, POST /api/auth/login
│   │   ├── news.js               ← GET /api/news, GET /api/news/:id
│   │   ├── tenders.js            ← GET /api/tenders, GET /api/tenders/:id
│   │   └── submissions.js        ← POST /api/submissions, GET /api/submissions/mine
│   ├── uploads/                  ← Uploaded e-bid documents (PDF/ZIP)
│   └── views/                    ← HTML pages (TO BE BUILT)
├── public/
│   ├── css/                      ← Stylesheets (TO BE BUILT)
│   ├── js/                       ← Frontend scripts (TO BE BUILT)
│   └── images/                   ← Static images
├── database/
│   ├── schema.sql                ← SQLite-compatible table definitions
│   ├── tetfund.db                ← Live SQLite database file
│   ├── fix_news_titles.js        ← News scraper (already run)
│   ├── fix_scraper.js            ← Team + nav scraper (already run)
│   ├── team_seed.json            ← 13 management team members
│   ├── navigation_seed.json      ← 37 navigation links
│   └── documents_seed.json       ← 3 downloadable documents
├── diagrams/                     ← Draw.io file (TO BE PLACED HERE)
├── docs/                         ← Docx report (TO BE PLACED HERE)
├── .env                          ← Environment variables
├── .gitignore
└── package.json
```

---

## Database Schema (SQLite)

### Tables Created and Seeded

| Table | Records | Description |
|---|---|---|
| USERS | 1 (admin seed) | All user accounts — Contractor, Beneficiary, Administrator |
| NEWS | 39 | Real news articles scraped from live TETFund site |
| TENDERS | 0 | Procurement opportunities (to be populated via admin) |
| SUBMISSIONS | 0 | E-bid submissions from contractors |
| AUDIT_LOG | 0 | System event log |

### Key Relationships
- USERS → TENDERS (AdminID): Admin publishes tenders
- USERS → SUBMISSIONS (UserID): Contractor submits bids
- TENDERS → SUBMISSIONS (TenderID): Each submission targets one tender
- USERS → NEWS (AdminID): Admin authors news

---

## API Routes (All Working)

### Authentication — `/api/auth`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register new Contractor or Beneficiary |
| POST | `/api/auth/login` | None | Login, returns JWT token |

### News — `/api/news`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/news` | None | Get all news (latest 20) |
| GET | `/api/news/:id` | None | Get single news article |

### Tenders — `/api/tenders`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/tenders` | None | Get all tenders (filterable by category/status) |
| GET | `/api/tenders/:id` | None | Get single tender |

### Submissions — `/api/submissions`
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/submissions` | Contractor JWT | Submit e-bid document (PDF/ZIP, max 50MB) |
| GET | `/api/submissions/mine` | Contractor JWT | Get own submission history |

### Admin Routes — NOT YET BUILT
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/tenders` | Admin JWT | Create new tender |
| PUT | `/api/tenders/:id` | Admin JWT | Update tender |
| GET | `/api/admin/submissions` | Admin JWT | View all submissions |
| PUT | `/api/admin/submissions/:id` | Admin JWT | Update submission status |
| POST | `/api/news` | Admin JWT | Publish news article |

---

## What Has Been Completed

### Documentation
- [x] Chapter 1 — Introduction (fully rewritten, humanised voice)
- [x] Chapter 2 — Literature Review (15 papers, 6-column table, theoretical framework)
- [x] Chapter 3 — Methodology (data dictionary, pseudocode, security section)
- [x] References (20 properly formatted APA citations)
- [x] Four diagrams in draw.io (Three-Tier Architecture, Use Case, ER Diagram, System Flowchart)

### Backend
- [x] Node.js + Express app skeleton
- [x] SQLite database with all 5 tables
- [x] JWT authentication with role-based access control middleware
- [x] News routes (read)
- [x] Tenders routes (read)
- [x] Submissions route (create with file upload validation)
- [x] Submission history route
- [x] Audit logging on submissions
- [x] Live site cloned via HTTrack (136MB)
- [x] 39 real news articles scraped and seeded
- [x] 13 management team members saved to JSON

### Frontend
- [ ] Nothing built yet

---

## What Needs To Be Built Next

### Priority 1 — Frontend Pages

#### 1. `public/index.html` — Public Homepage
- TETFund header with logo and navigation (use cloned site as visual reference)
- Hero section with mission statement
- Live news feed (calls GET /api/news)
- Active tenders board (calls GET /api/tenders?status=Active)
- Management team section (reads from team_seed.json or a static section)
- Footer with links

#### 2. `public/auth.html` — Login and Register Page
- Tab switcher between Login and Register forms
- Register: Full Name, Email, Password, Role (Contractor/Beneficiary)
- Login: Email, Password
- On success: store JWT token in sessionStorage, redirect to dashboard
- On failure: show inline error message

#### 3. `public/dashboard.html` — Contractor Dashboard
- Protected page (redirect to auth.html if no token)
- Show active tenders in a searchable table
- E-bid submission form:
  - Step 1: Select tender from dropdown
  - Step 2: Select category (Works / Goods / Services) — MANDATORY
  - Step 3: Upload PDF or ZIP file
  - Step 4: Review and submit
  - On success: show Submission ID and timestamp
- My Submissions table with status badges (Received / Under Evaluation / Approved / Rejected)

#### 4. `public/admin.html` — Administrator Dashboard
- Protected page (redirect if not Administrator role)
- Publish new tender form
- View all submissions grouped by tender
- Update submission status dropdown
- Publish news article form
- Simple stats: total submissions, active tenders, registered contractors

### Priority 2 — Admin API Routes
Build these in `src/routes/admin.js`:
- POST /api/tenders (create tender)
- PUT /api/tenders/:id (update tender status)
- GET /api/admin/submissions (all submissions with user and tender info)
- PUT /api/admin/submissions/:id/status (update status)
- POST /api/news (create news article)
- GET /api/admin/stats (dashboard counts)

### Priority 3 — Polish
- Responsive CSS for all pages (mobile-first)
- Form validation feedback
- Loading states on API calls
- Success/error toast notifications
- Export submissions to CSV (admin)

---

## Environment Variables (.env)

```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=tetfund_db
JWT_SECRET=tetfund_secret_key_change_this
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
```

---

## How To Run The Project

```bash
# Navigate to project
cd /mnt/c/Users/onahe/OneDrive/Desktop/StudentProjects/tetfund-revamp

# Install dependencies (already done)
npm install

# Start server
npm start

# Server runs at http://localhost:3000
```

---

## Seeded Admin Account

| Field | Value |
|---|---|
| Email | admin@tetfund.gov.ng |
| Password | (not set — placeholder hash, needs update) |
| Role | Administrator |

To set a real admin password, run in WSL:

```bash
node -e "
const db = require('./src/config/db');
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('Admin@TETFund2025', 12);
db.prepare(\"UPDATE USERS SET PasswordHash = ? WHERE Email = ?\").run(hash, 'admin@tetfund.gov.ng');
console.log('Admin password updated');
db.close();
"
```

---

## Prompt For New Claude Session

Paste this at the start of the new conversation, followed by the output of:

```bash
for f in src/app.js src/config/db.js src/middleware/auth.js src/routes/auth.js src/routes/tenders.js src/routes/submissions.js src/routes/news.js; do echo "=== $f ==="; cat $f; echo; done
```

**Prompt:**

> I am continuing a TETFund website revamp project (final year CS project, Federal University of Lafia). The Node.js + Express + SQLite backend is fully built and running on port 3000. All backend routes are working. I now need to build the HTML frontend. There are 4 pages needed: (1) public homepage with live news and tenders feed, (2) login/register page with JWT auth, (3) contractor dashboard with e-bid submission form, (4) admin dashboard. I also need the admin API routes. The project is at `/mnt/c/Users/onahe/OneDrive/Desktop/StudentProjects/tetfund-revamp`. Here are my current source files: [paste file output here]

---

*Document generated at end of Session 1. Project is approximately 60% complete.*
