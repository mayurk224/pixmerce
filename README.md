# <p align="center">🛍️ Pixmerce</p>

<p align="center">
  <strong>A e-commerce platform where every price is a conversation.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Google_Gemini-Pro-4285F4?logo=google-gemini&logoColor=white" alt="Gemini" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 🌟 Overview

**Pixmerce** is a next-generation "Negotiation-as-a-Service" e-commerce storefront. Traditional shops have fixed prices; Pixmerce introduces **AI Storekeepers**—dynamic entities powered by Google's Gemini Pro that allow customers to bargain for better deals in real-time. Whether you're hunting for a rare pixel artifact or everyday essentials, Pixmerce turns shopping into an interactive game of strategy and persuasion.

## 🚀 Key Features

- **🤖 AI-Powered Negotiation:** Real-time price bargaining with AI-driven shopkeepers using LangChain and Google's Generative AI.
- **🏬 Dynamic Shopfronts:** Explore various virtual boutiques with distinct inventories and shopkeeper personalities.
- **🔐 Secure Auth:** Seamless onboarding with Google OAuth 2.0 integration for both frontend and backend.
- **⚡ High Performance:** Optimized backend utilizing Redis for session management and fast response times.
- **🎨 Premium UI/UX:** Built with React 19 and Tailwind CSS 4, featuring glassmorphic designs and smooth transitions.

## 📂 Architecture & Structure

```ascii
pixmerce/
├── client/                # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable UI elements
│   │   ├── context/       # Auth & Global State
│   │   ├── services/      # API communication
│   │   └── App.jsx        # Main routing & layout
│   └── tailwind.config.js # Modern CSS styling
├── server/                # Node.js Backend (Express)
│   ├── src/
│   │   └── app.js         # Express configuration
│   ├── models/            # MongoDB Schemas
│   ├── routers/           # API Endpoints
│   ├── controllers/       # Business logic
│   └── services/          # Gemini AI & External integrations
└── package.json           # Root workspace configuration
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** (Local or Atlas)
- **Redis Server**
- **Google Cloud Console Account** (for OAuth & Gemini API)

### 📥 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/pixmerce.git
   cd pixmerce
   ```

2. **Setup the Server:**
   ```bash
   cd server
   npm install
   # Create a .env file and add details from the Environment Variables section below
   npm run dev
   ```

3. **Setup the Client:**
   ```bash
   cd ../client
   npm install
   # Create a .env file and add VITE_GOOGLE_CLIENT_ID
   npm run dev
   ```

## ⚙️ Environment Variables

### Server (`server/.env`)
| Variable | Description |
| :--- | :--- |
| `PORT` | The port the server will run on (Default: 5000) |
| `MONGO_URL` | MongoDB Connection String |
| `FRONTEND_URL` | URL of the frontend (for CORS) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret |
| `JWT_SECRET` | Secret key for JWT signing |
| `REDIS_HOST` | Redis instance hostname |
| `REDIS_PASSWORD` | Redis authentication password |
| `GEMINI_API_KEY` | Google Gemini Pro API Key |

### Client (`client/.env`)
| Variable | Description |
| :--- | :--- |
| `VITE_GOOGLE_CLIENT_ID` | Public Google OAuth Client ID |

---

<p align="center">
  Built with ❤️ by the Pixmerce Team.
</p>
