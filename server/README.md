<p align="center">
  <h1 align="center">Pixmerce Server</h1>
</p>

<p align="center">
  <strong>The AI-powered bargaining backend for the Pixmerce e-commerce platform.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" />
  <img src="https://img.shields.io/badge/Google%20Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Google Gemini" />
</p>

---

## 📖 Overview

Pixmerce Server is the robust backbone of the Pixmerce ecosystem. It provides a sophisticated API for managing virtual shops, inventories, and user authentication. The standout feature is its **AI-driven negotiation engine**, which leverages Google's Gemini LLM via LangChain to allow users to bargain for prices in real-time, creating a dynamic and interactive shopping experience.

## ✨ Key Features

-   🤖 **AI-Powered Negotiation**: Real-time price bargaining using Google Gemini and LangChain integrations.
-   🔐 **Secure Authentication**: Robust user management with JWT-based sessions and Google OAuth support.
-   🏬 **Shop & Inventory Management**: Full CRUD operations for virtual storefronts, categories, and items.
-   ⚡ **High-Performance Caching**: Integrated Redis support for fast data retrieval and session management.
-   🛠️ **Modern Tech Stack**: Built with Express 5, Mongoose for ODM, and ESM for a clean, modular codebase.

## 🏗️ Architecture & Structure

```text
server/
├── config/             # Configuration for DB, Cache, and AI
├── controllers/        # Request handling logic
├── middlewares/        # Custom Express middlewares
├── models/             # Mongoose schemas and data models
├── routers/            # API route definitions
├── services/           # External service integrations (AI, Email, etc.)
├── src/
│   └── app.js          # Express app setup and middleware mounting
├── utils/              # Helper functions and utilities
└── server.js           # Server entry point
```

## 🚀 Getting Started

### Prerequisites

-   **Node.js**: v18.x or higher
-   **MongoDB**: A running instance or MongoDB Atlas URI
-   **Redis**: Local instance or managed service
-   **Google API Key**: For Gemini AI features

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd pixmerce/server
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up environment variables**:
    Create a `.env` file in the root directory and add the required variables (see below).

### Running the App

-   **Development mode** (with auto-reload):
    ```bash
    npm run dev
    ```

-   **Production mode**:
    ```bash
    npm start
    ```

## 🔑 Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `PORT` | Port for the server to listen on | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/pixmerce` |
| `REDIS_URI` | Redis connection string | `redis://localhost:6379` |
| `GOOGLE_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `FRONTEND_URL` | Allowed CORS origins (comma-separated) | `http://localhost:5173` |
| `JWT_SECRET` | Secret key for JWT signing | `your_secret_key` |
| `NODE_ENV` | Running environment | `development` |

---

<p align="center">
  Built with ❤️ for the Pixmerce Community
</p>
