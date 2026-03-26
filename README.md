# VicTask: Enterprise Task Management System (WSO2 Internship Project)

VicTask is a production-ready task management application designed for secure, high-performance identity management and real-time persistence. This project is submitted as primary evidence for the **WSO2 Engineering Internship** application, fulfilling the requirement for a professional-grade product integration.

## 🏢 Technical Architecture: WSO2 Asgardeo + Firebase Bridge

This application implements a sophisticated **Hybrid Identity Bridge** that combines the enterprise-grade identity management of **WSO2 Asgardeo** with the high-performance local caching and real-time persistence of **Google Firebase**.

### Core Technical Implementations

*   **Custom Identity Anchoring**: Task ownership is strictly anchored to the permanent **Asgardeo `sub` (UID)**, ensuring 100% data persistence and consistency across refreshes, devices, and browsers.
*   **OIDC Standard Compliance**: Utilizes `@asgardeo/auth-react` for standardized authentication, including **Authorization Code Flow with PKCE** to prevent code injection attacks.
*   **Firebase Auth Bridge**: Implements a silent hand-shake where Asgardeo-authenticated sessions are mirrored into a Firebase Anonymous session, allowing secure Cloud Firestore access without exposing private credentials.
*   **AdBlocker-Resilient Persistence**: Configured with **Experimental Long Polling** and **Persistent Local Caching**. This ensures the application remains functional even in restrictive network environments (e.g., corporate firewalls or aggressive browser AdBlockers).
*   **Deep Identity Mapping**: Advanced OIDC claim mapping to extract and display Google profile details (Email, Name, Picture) even when identity providers use non-standardized claim keys.

## 🚀 Product Features

*   **Secure Authentication**: Enterprise-grade login powered by **WSO2 Asgardeo**.
*   **Cloud Persistence**: Seamless, real-time task synchronization across multiple tabs and devices.
*   **Offline Mode**: Fully functional task creation even without an active internet connection, with background synchronization.
*   **Brutalist "Liquid Glass" UI**: A premium, responsive design system built for performance and visual excellence.
*   **Smart Categorization**: Starred tasks, subtask nesting, and dynamic list-aware views.

## 🛠️ Technology Stack

*   **Identity & Auth**: WSO2 Asgardeo (OIDC)
*   **Database & Sync**: Google Firebase (Cloud Firestore)
*   **Framework**: React (Vite 6), TypeScript
*   **Styling**: TailwindCSS (Modern Glassmorphism)
*   **State Management**: Zustand, React Query
*   **Iconography**: Lucide React

## 📦 Installation and Configuration

### 1. Asgardeo Console setup
1.  Register a **Single Page Application (SPA)**.
2.  Set **Redirect URI** and **Allowed Origins** to `http://localhost:5173`.
3.  **User Attributes**: Select `Email`, `givenName`, and `familyName` as **Requested** attributes.
4.  **Connections**: Enable Google federation.

### 2. Firebase Console setup
1.  Create a **Firestore Database** in **Production Mode**.
2.  Enable **Anonymous Sign-in** in the Authentication tab.
3.  Set Rules: `allow read, write: if request.auth != null;`.

### 3. Local setup
Create a `.env` file in the root directory:
```env
VITE_ASGARDEO_CLIENT_ID="your_client_id"
VITE_ASGARDEO_BASE_URL="https://api.asgardeo.io/t/your_org_name"
VITE_ASGARDEO_REDIRECT_URL="http://localhost:5173"

VITE_FIREBASE_API_KEY="your_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_project.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_project.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_sender_id"
VITE_FIREBASE_APP_ID="your_app_id"
```