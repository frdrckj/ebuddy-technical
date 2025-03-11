# Fullstack Monorepo: Firebase, Express, and Next.js

A monorepo project using Turborepo with an Express.js backend and Next.js frontend, integrated with Firebase.

## Structure

- **apps/frontend**: Next.js with MUI and Redux
- **apps/backend**: Express.js with Firebase
- **packages/shared**: Shared types and utilities

## Getting Started

- Node.js 16+ and npm
- Firebase project
- Firebase CLI installed globally: `npm install -g firebase-tools`

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` files to `.env` in both frontend and backend directories
   - Fill in your Firebase configuration details

4. Build all packages:

```bash
npm run build
```

### Development

Run the entire project in development mode:

```bash
npm run dev
```

### Using Firebase Emulators

Start the Firebase emulators:
Start from the backend directory

```bash
firebase emulators:start
```

Make sure the environment variables are set to use the emulators:

- In backend: `USE_FIREBASE_EMULATOR=true`
- In frontend: `NEXT_PUBLIC_USE_FIREBASE_EMULATOR=true`
