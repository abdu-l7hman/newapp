# Investo (prototype)

Quick local instructions to run the prototype and notes about configuration.

Requirements
- Node.js (v16+ recommended)
- npm (or use yarn/pnpm if you prefer)

Local dev

1. Install dependencies:

   npm install

2. Start the dev server:

   npm run dev

3. Open the app in your browser:

   http://127.0.0.1:5173/

Notes
- The project uses Vite + React + TailwindCSS.
- The app includes a simple in-memory fallback, so it runs without Supabase configured. The login form is a local mock and will let you enter any email/password to continue.
- To enable Supabase features, create a `.env` file with the variables shown in `.env.example` and restart the dev server.

Linting
- ESLint is configured as an npm script, but there is no project ESLint config file. If you want to enable linting, run `npm init @eslint/config` and add a config.

Troubleshooting
- If port 5173 is already in use, Vite will try the next port (5174, 5175...). Check the console logs for the actual port.
- If the app fails to start with a syntax or JSX error, look at the terminal output and the file/line printed by Vite; common fixes include unclosed JSX fragments or stray comments.

Contact
- If you want me to add automated smoke tests, a Playwright script, or wire real Supabase auth, tell me and I can implement it.
