# <p align="center">✨ Pixmerce Client</p>

<p align="center">
  <strong>An immersive, AI-integrated storefront with parallax visuals and atmospheric soundscapes.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Google_OAuth-4285F4?logo=google&logoColor=white" alt="OAuth" />
  <img src="https://img.shields.io/badge/Axios-Latest-5A29E4?logo=axios&logoColor=white" alt="Axios" />
</p>

---

## 🧭 Overview

The **Pixmerce Client** is the visual gateway to a futuristic shopping experience. Built with a focus on immersion, it utilizes **React 19** and **Tailwind CSS 4** to deliver a high-fidelity interface. Beyond simple transactions, the client features a unique "Signal Scanning" shop discovery system and a direct, real-time negotiation terminal powered by Google's Gemini AI. 

## 💎 Key Features

- **🌌 Parallax Visuals:** Interactive, mouse-responsive background layers creating a deep 3D field-of-view.
- **🤝 AI Negotiation Logic:** Integrated terminal for real-time bargaining with AI-driven storekeepers.
- **🛰️ Signal Scan Discovery:** A sci-fi inspired interface for searching and entering active shop clusters.
- **🔊 Atmospheric Audio:** Seamless background soundscapes with integrated mute/volume controls.
- **🛡️ Secure Onboarding:** Frictionless Google OAuth 2.0 login for personalized shop history and inventory tracking.
- **✨ Glassmorphic UI:** Modern design system featuring backdrop-blur effects and sharp, futuristic accents.

## 🏗️ Architecture & Structure

```ascii
client/
├── public/           # Static assets (Backgrounds, SFX)
├── src/
│   ├── components/   # UI building blocks (Navbar, ChatTerminal, Modals)
│   ├── context/      # Authentication & global state providers
│   ├── hooks/        # Performance-optimized custom hooks
│   ├── pages/        # Main view-level components (Home, Dashboard)
│   ├── services/     # API orchestration layer
│   ├── App.jsx       # Layout & Route definitions
│   └── main.jsx      # Application entry point
├── package.json      # Dependency manifest
└── vite.config.js    # Vite 8.0 build configuration
```

## 🛠️ Getting Started

### Prerequisites

- **Node.js** (v20+ recommended)
- **npm** or **yarn**

### 📥 Installation 

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment:**
   Create a `.env` file in the `client/` directory:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
   ```

3. **Launch Development Server:**
   ```bash
   npm run dev
   ```
   Interact with the app at `http://localhost:5173`.

---

<p align="center">
  Part of the <strong>Pixmerce</strong> ecosystem.
</p>
