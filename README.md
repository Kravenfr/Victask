# Victask - Minimal Task Management

A production-ready task management web app inspired by Google Tasks.

## Features
- **Modern Authentication**: Secure login integrated with WSO2 Asgardeo.
- **Real-time Sync**: Tasks and lists sync effortlessly across devices.
- **Minimalist UI**: Clean, modern design with smooth animations.
- **Mobile First**: Fully responsive layout that works on all devices.
- **Task Organization**: Categorize tasks into multiple lists.
- **Smart Views**: Filter by Today, Active, Completed, or All.

## Tech Stack
- **Frontend**: React (Vite), TypeScript, TailwindCSS
- **Authentication**: WSO2 Asgardeo (@asgardeo/auth-react)
- **State Management**: Zustand, React Query
- **Icons**: Lucide React
- **Animations**: Standard CSS transitions

## Getting Started

### Prerequisites
- Node.js (v18+)
- An Asgardeo Account

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create an application in [Asgardeo Console](https://console.asgardeo.io/)
4. Enable **OpenID Connect** and configure your redirect URLs.
5. Create a `.env` file in the root based on `.env.example`.
6. Add your Asgardeo credentials to the `.env` file.
7. Start the development server:
   ```bash
   npm run dev
   ```

## License
MIT
