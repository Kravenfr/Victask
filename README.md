VicTask: Enterprise Task Management System
VicTask is a production-ready task management application designed for secure, high-performance identity management. This project is submitted as primary evidence for the WSO2 Engineering Internship application, fulfilling the 2-point requirement for a real-world product integration.

Technical Architecture: WSO2 Asgardeo Integration
This application implements a robust Customer Identity and Access Management (CIAM) architecture using the WSO2 Asgardeo platform.

Core Security Implementations
OpenID Connect (OIDC) Standards: The application utilizes OIDC for standardized authentication and authorization, ensuring interoperability and security.

Authorization Code Flow with PKCE: Implemented Proof Key for Code Exchange (PKCE) to secure the frontend-to-Asgardeo communication, effectively preventing authorization code injection and interception attacks.

Identity Federation: Configured Google Identity Federation via Asgardeo Connections, allowing for centralized policy management while providing a seamless user experience.

Higher-Order Protected Routing: Developed a custom ProtectedRoute React component that intercepts unauthenticated requests at the middleware level, shielding sensitive application state from unauthorized access.

Stateless Session Management: Integrated the @asgardeo/auth-react SDK to manage JWT-based sessions, providing secure token storage and automated refresh cycles.

Product Features
Secure Authentication: Enterprise-grade login powered by WSO2 Asgardeo.

Real-time Synchronization: Concurrent task and list updates across multiple devices.

Optimized UI/UX: High-performance, responsive design with a focus on desktop and mobile accessibility.

Categorized Task Management: Dynamic filtering for Today, Active, Completed, and All views.

Technology Stack
Identity Provider: WSO2 Asgardeo

Framework: React (Vite), TypeScript

Authentication SDK: @asgardeo/auth-react

Styling: TailwindCSS

State Management: Zustand, React Query

Iconography: Lucide React

Installation and Configuration
1. Asgardeo Console Configuration
To initialize the authentication layer, register a Single Page Application (SPA) in the Asgardeo Console with the following settings:

Authorized Redirect URI: http://localhost:5173

Allowed Origins: http://localhost:5173

Connections: Enable Google under the authentication tab.

2. Environment Configuration
Create a .env file in the root directory with the following variables:

Code snippet
VITE_ASGARDEO_CLIENT_ID="YOUR_CLIENT_ID"
VITE_ASGARDEO_BASE_URL="https://api.asgardeo.io/t/YOUR_ORG_NAME"
VITE_ASGARDEO_REDIRECT_URL="http://localhost:5173"
3. Execution
Bash
npm install
npm run dev
