# TETFund Website Revamp — Interactive Portal

This is a comprehensive website revamp project for the **Tertiary Education Trust Fund (TETFund)**, turning the original static information portal into an interactive, transactional web platform. 

This project is a final year Computer Science project for **Umar, Ya'u Sadiq (2022/CP/CSC/0069)** at the **Federal University of Lafia**.

---

## 🚀 Key Features

### 🏢 Public Landing Page
*   **Dynamic News & ITT Feeds**: Fetches and renders the latest news articles and active Invitation to Tender (ITT) listings directly from the database.
*   **Management Team Directory**: Displays information about management board members.
*   **Documents Center**: Downloadable templates, guides, and policy documents.

### 🔑 Authentication Portal
*   **Dual-Tab Interface**: Single page for both registration and login, with tab switching.
*   **Role-Based Access Control**: Supports different roles including **Contractor** (Bidder), **Beneficiary Institution**, and **Administrator**.
*   **Security**: Password hashing with `bcryptjs` and session-based JSON Web Tokens (JWT).

### 💼 Contractor E-Bid Dashboard
*   **Tender Selection**: Interactive dropdown pulling live active procurement options.
*   **Procurement Category Guard**: Mandatory category selection (Works, Goods, Services) to prevent incorrect box submissions and subsequent disqualification.
*   **Secure Document Upload**: File validation supporting PDFs and ZIP files (up to 50MB) with automatic storage routing.
*   **Submission History**: View real-time feedback with color-coded status badges indicating review progress.

### 🛡️ Admin Portal (Fully Responsive)
*   **Clean Sidebar Layout**: Modern dark theme sidebar for desktop view, collapsing into a clean hamburger menu overlay on mobile screen widths.
*   **System Overview Dashboard**: Instant data metrics (Total Submissions, Active Tenders, Registered Contractors).
*   **Publish ITT**: Interactive form to publish invitations to tender (Title, Scope/Description, Category, Status, Dates).
*   **Submissions Review**: Table displaying all contractor uploads, document access links, and inline status modification dropdowns (`Under Evaluation`, `Approved`, `Rejected`).
*   **News Publishing System**: Form to publish updates/news articles with headlines and content.

---

## 🛠️ Technology Stack

*   **Backend Runtime**: Node.js (v20 LTS)
*   **Web Framework**: Express.js (v4)
*   **Database (Development)**: SQLite (v3) via `better-sqlite3`
*   **Database (Production)**: MySQL (v8 compatible)
*   **Authentication**: JSON Web Tokens (JWT) + bcryptjs
*   **File Uploads**: Multer
*   **Frontend**: HTML5, CSS3 (Tailwind CSS base + custom inline responsive style overrides), Vanilla JavaScript (ES6+)

---

## 📁 Project Directory Structure

```text
tetfund-revamp/
├── src/                          ← Express backend codebase
│   ├── app.js                    ← Express application entry point (PORT 3000)
│   ├── config/                   ← Database connections (SQLite via better-sqlite3)
│   ├── controllers/              ← Request handlers (Auth, Admin, Submissions, News)
│   ├── middleware/               ← JWT Role validation (requireRole, authenticate)
│   ├── routes/                   ← REST API Endpoints (Auth, Tenders, Submissions, Admin)
│   └── uploads/                  ← Uploaded contractor PDFs/ZIPs (gitignored)
├── public/                       ← Static frontend files
│   ├── css/                      ← Stylesheets and base templates
│   ├── js/                       ← Vanilla JS logic (admin.js, dashboard.js, auth.js)
│   ├── index.html                ← Public home portal
│   ├── auth.html                 ← Auth register/login page
│   ├── dashboard.html            ← Contractor submit & history portal
│   └── admin.html                ← Standalone Admin Portal
├── database/                     ← SQL schemas and seed data scripts
│   ├── schema.sql                ← SQLite-compatible database tables
│   ├── seed_dummy_data.js        ← Seeding script for testing datasets
│   ├── tetfund.db                ← Live development SQLite database (gitignored)
│   └── *.json                    ← Scraped seeds (management team, navigation)
├── scripts/                      ← Workspace build and maintenance tools
│   ├── fix_pages.js              ← Page-compiler generating templates into public/
│   └── migrate_all.js            ← Database migration tool
├── .env                          ← Environment configurations (gitignored)
├── .gitignore                    ← Git ignore rules
└── package.json                  ← Node dependencies & scripts
```

---

## ⚙️ Configuration & Environment Setup

1.  Create a file named `.env` in the root folder.
2.  Configure your environment variables like so:
    ```env
    PORT=3000
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=
    DB_NAME=tetfund_db
    JWT_SECRET=your_super_secret_jwt_key
    SMTP_HOST=smtp.gmail.com
    SMTP_PORT=587
    SMTP_USER=your_email@gmail.com
    SMTP_PASS=your_email_app_password
    ```

---

## 🚀 Installation & Running the Server

### 1. Install Dependencies
Run the command below in the terminal:
```bash
npm install
```

### 2. Setup and Seed the Database
Run migrations to set up the SQLite schema and seed it with original scraped news/nav data:
```bash
node scripts/migrate_all.js
```
*(Alternatively, you can run `node database/seed_dummy_data.js` to populate mock bid entries for testing).*

### 3. Generate HTML Templates
Compile the frontend static pages using the template builder:
```bash
node scripts/fix_pages.js
```

### 4. Start the Application
Start the Express server locally:
```bash
npm start
```
The application will be running at `http://localhost:3000`.

---

## 💡 Production Styling Note (Tailwind Purging)
This project operates with a pre-compiled and purged Tailwind CSS stylesheet. To ensure visual stability and prevent mobile layout classes (like scroll handlers and grids) from being ignored, **all newly added components use explicit inline CSS styles** (e.g. `style="overflow-x: auto;"`). Do not rely on JIT-compiled Tailwind utility classes for new HTML wrappers.
