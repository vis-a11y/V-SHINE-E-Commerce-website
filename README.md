# 🛍️ V-SHINE — E-Commerce Website

<div align="center">

![V-SHINE Banner](public/image/logo.png)

[![GitHub Pages](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-blue?style=for-the-badge&logo=github)](https://vis-a11y.github.io/V-SHINE-E-Commerce-website/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange?style=for-the-badge&logo=mysql)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge)](LICENSE)

**A modern, full-stack e-commerce web application with a Node.js/Express backend, MySQL database, and a responsive HTML/CSS/JS frontend — automatically deployed to GitHub Pages.**

[🌐 Live Demo](https://vis-a11y.github.io/V-SHINE-E-Commerce-website/) · [🐛 Report Bug](https://github.com/vis-a11y/V-SHINE-E-Commerce-website/issues) · [✨ Request Feature](https://github.com/vis-a11y/V-SHINE-E-Commerce-website/issues)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running Locally](#running-locally)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [GitHub Pages Note](#-github-pages-note)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 About the Project

**V-SHINE** is a feature-rich e-commerce platform built for clothing and accessories. It sports a sleek, responsive UI with dark mode support, smooth scroll animations, a persistent shopping cart, interactive product cards with 3D tilt effects, and a full Node.js + MySQL backend for real-time data.

The frontend is **automatically deployed to GitHub Pages** on every push to `main`, while the backend can be self-hosted on any Node.js-compatible server.

---

## ✨ Features

### 🖥️ Frontend
| Feature | Description |
|---|---|
| 🌙 **Dark / Light Mode** | Persistent theme toggle saved to `localStorage` |
| 🛒 **Shopping Cart** | Add, update, remove items — persisted via `localStorage` |
| 📦 **Dynamic Products** | Products loaded from MySQL API; falls back to static data on GitHub Pages |
| 🎴 **3D Tilt Cards** | Interactive product cards using Vanilla Tilt |
| 🎞️ **Scroll Animations** | Smooth reveal animations powered by AOS |
| 📊 **Scroll Progress Bar** | Visual reading progress indicator at the top |
| 🔔 **Toast Notifications** | Cart confirmations and form feedback |
| 📱 **Fully Responsive** | Mobile-first design with hamburger navigation |
| 🔝 **Back to Top** | Floating scroll-to-top button |
| 📧 **Newsletter Signup** | Email subscription form connected to backend |
| 📬 **Contact Form** | Message submission saved to the database |

### ⚙️ Backend
| Feature | Description |
|---|---|
| 🚀 **Express.js REST API** | Clean API architecture with proper error handling |
| 🗄️ **MySQL Integration** | Connection pooling via `mysql2/promise` |
| 🌍 **CORS Enabled** | Cross-origin requests supported |
| 🔐 **Environment Config** | Secrets managed via `.env` (never committed) |
| 📡 **Products API** | Serve dynamic product listings from the database |
| 📮 **Contact API** | Save contact form submissions to MySQL |
| 📰 **Subscribe API** | Unique email newsletter subscriptions |

---

## 🧰 Tech Stack

### Frontend
- **HTML5** — Semantic page structure
- **CSS3** — Custom properties, flexbox, grid, animations
- **Vanilla JavaScript** — DOM manipulation, fetch API, localStorage
- **[AOS](https://michalsnik.github.io/aos/)** — Animate on Scroll library
- **[Vanilla Tilt](https://micku7zu.github.io/vanilla-tilt.js/)** — 3D tilt hover effects
- **[Font Awesome 6](https://fontawesome.com/)** — Icon library

### Backend
- **[Node.js](https://nodejs.org/)** — JavaScript runtime
- **[Express.js v5](https://expressjs.com/)** — Web framework
- **[MySQL2](https://github.com/sidorares/node-mysql2)** — Promise-based MySQL driver
- **[dotenv](https://github.com/motdotla/dotenv)** — Environment variable management
- **[cors](https://github.com/expressjs/cors)** — Cross-origin resource sharing
- **[body-parser](https://github.com/expressjs/body-parser)** — Request body parsing

### DevOps & Tooling
- **GitHub Actions** — CI/CD for automatic GitHub Pages deployment
- **nodemon** — Auto-restart during local development
- **MySQL 8** — Relational database

---

## 📁 Project Structure

```
V-SHINE/
├── .github/
│   └── workflows/
│       └── static.yml          # GitHub Actions: deploys public/ to GitHub Pages
├── public/                     # ← Static frontend (served by GitHub Pages)
│   ├── index.html              # Home page
│   ├── shop.html               # Shop / product listing
│   ├── sproduct.html           # Single product detail
│   ├── cart.html               # Shopping cart
│   ├── About.html              # About us page
│   ├── blog.html               # Blog page
│   ├── contact.html            # Contact form page
│   ├── style.css               # Global stylesheet
│   ├── script.js               # Frontend logic (cart, animations, API calls)
│   └── image/                  # All images, logos, product photos
├── server.js                   # Express.js backend (API server)
├── setup_database.sql          # MySQL schema + seed data
├── package.json                # Node.js dependencies & scripts
├── .env                        # 🔒 Local environment variables (NOT committed)
├── .gitignore                  # Excluded files (node_modules, .env, etc.)
└── README.md                   # You are here
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) **v18 or higher**
- [MySQL](https://www.mysql.com/) **v8.0 or higher**
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vis-a11y/V-SHINE-E-Commerce-website.git
   cd V-SHINE-E-Commerce-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Environment Variables

Create a `.env` file in the project root (it's already in `.gitignore` so your secrets stay safe):

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=vshine_db
```

> ⚠️ **Never commit your `.env` file.** Keep your database credentials private.

### Database Setup

1. Open MySQL and run the setup script:
   ```bash
   mysql -u root -p < setup_database.sql
   ```

   This will:
   - Create the `vshine_db` database
   - Create `products`, `contacts`, and `subscriptions` tables
   - Insert 8 sample products to get you started

2. **Database Schema Overview:**

   | Table | Description |
   |---|---|
   | `products` | Product catalog (name, brand, price, image, category) |
   | `contacts` | Contact form submissions from users |
   | `subscriptions` | Newsletter email subscriptions (unique emails) |

### Running Locally

**Start the development server:**
```bash
npm run dev
```

Or for production:
```bash
npm start
```

The backend API will be available at: **`http://localhost:5000`**

Open `public/index.html` in your browser, or navigate to `http://localhost:5000` to view the full app served by Express.

---

## 📡 API Endpoints

Base URL (local): `http://localhost:5000/api`

| Method | Endpoint | Description | Body |
|---|---|---|---|
| `GET` | `/api/products` | Fetch all products | — |
| `POST` | `/api/subscribe` | Newsletter subscription | `{ email }` |
| `POST` | `/api/contact` | Submit contact form | `{ name, email, subject, message }` |

### Example Requests

**Get all products:**
```bash
curl http://localhost:5000/api/products
```

**Subscribe to newsletter:**
```bash
curl -X POST http://localhost:5000/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

**Submit contact form:**
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Vishal","email":"v@example.com","subject":"Hello","message":"Great site!"}'
```

---

## 🚢 Deployment

### GitHub Pages (Frontend Only — Automatic)

The frontend (`public/` folder) is automatically deployed to GitHub Pages via GitHub Actions on every push to the `main` branch.

**Live URL:** `https://vis-a11y.github.io/V-SHINE-E-Commerce-website/`

**To set up GitHub Pages for your fork:**
1. Go to your repo → **Settings → Pages**
2. Set **Source** to `GitHub Actions`
3. Push to `main` — the workflow will trigger automatically ✅

### Backend Deployment Options

Since GitHub Pages only serves static files, the **Node.js backend must be hosted separately**. Recommended platforms:

| Platform | Free Tier | Notes |
|---|---|---|
| [Railway](https://railway.app/) | ✅ Yes | Easiest — supports MySQL too |
| [Render](https://render.com/) | ✅ Yes | Free tier with sleep on inactivity |
| [Cyclic](https://www.cyclic.sh/) | ✅ Yes | Serverless Node.js |
| [Heroku](https://heroku.com/) | ❌ Paid | Most mature platform |
| [Azure App Service](https://azure.microsoft.com/) | ✅ Free tier | Workflow file included |

After deploying your backend, update `API_URL` in `public/script.js`:
```js
const API_URL = IS_GITHUB_PAGES ? 'https://your-backend.railway.app/api' : 'http://localhost:5000/api';
```

---

## 📌 GitHub Pages Note

> **GitHub Pages cannot run Node.js.** It's a static file host only.

When the site runs on GitHub Pages:
- 🟢 All HTML pages, CSS styles, and frontend JavaScript work perfectly
- 🟢 Shopping cart (localStorage) works fully
- 🟢 Dark mode, animations, and 3D effects work
- 🟡 Product listings show **static fallback data** (8 preset products)
- 🔴 Newsletter & contact form submissions require the backend to be running separately

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the **ISC License**. See [`package.json`](package.json) for details.

---

<div align="center">

Made with ❤️ by **Vishal Prajapati**

⭐ Star this repo if you found it helpful!

</div>
