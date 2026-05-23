# Church Management System

Admin dashboard for **City Mega Church** — manage people, departments, fellowships, attendance, messaging, and inventory.

## Tech Stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/) + shadcn/ui components
- [pnpm](https://pnpm.io/) (package manager)

## Prerequisites

Before you start, make sure you have:

| Tool | Version |
|------|---------|
| Node.js | 18.18+ (20+ recommended) |
| pnpm | 10.12.4 |

### Install pnpm (if needed)

```bash
corepack enable
corepack prepare pnpm@10.12.4 --activate
```

Check your versions:

```bash
node -v
pnpm -v
```

## Setup

### 1. Open the project

The folder name has a space — always quote the path in terminal commands:

```bash
cd "/Users/victormisiko/Desktop/church Management System"
```

### 2. Install dependencies

**Use pnpm, not npm.**

```bash
pnpm install
```

> If you previously ran `npm install`, stick with pnpm only. Delete `node_modules` and run `pnpm install` again if you hit dependency issues.

### 3. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Stop the server

Press `Ctrl + C` in the terminal.

## Environment Variables

No `.env` file is required. This is a frontend-only app with local/mock UI data — no database, auth backend, or API keys to configure.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Create production build |
| `pnpm start` | Run production server (after build) |
| `pnpm lint` | Run ESLint |

## Production Build

```bash
pnpm build
pnpm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/              # Next.js App Router pages
  attendance/     # Attendance tracking
  departments/    # Department management
  fellowships/    # Fellowship groups
  inventory/      # Inventory management
  messaging/      # Messaging
  people/         # Member management
components/       # React components (UI, layouts, features)
hooks/            # Custom React hooks
lib/              # Utilities and shared logic
styles/           # Global styles
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard |
| `/people` | Member management |
| `/departments` | Departments |
| `/fellowships` | Fellowship groups |
| `/attendance` | Attendance tracking |
| `/messaging` | Messaging |
| `/inventory` | Inventory overview |

## Troubleshooting

### Port 3000 already in use

```bash
pnpm dev -- -p 3001
```

Then open [http://localhost:3001](http://localhost:3001).

### Clean reinstall

```bash
cd "/Users/victormisiko/Desktop/church Management System"
rm -rf node_modules .next
pnpm install
pnpm dev
```

### `pnpm: command not found`

```bash
corepack enable
corepack prepare pnpm@10.12.4 --activate
```

### Used `npm install` by mistake

This project uses **pnpm**. Avoid mixing package managers. If install fails, remove `node_modules` and run `pnpm install`.

### Hydration warning on Attendance page

If you see a console error about `data-day` on the calendar, it is a locale mismatch in `components/ui/calendar.tsx`. Use a fixed locale (e.g. `"en-US"`) for date formatting in that file.

## Notes

- Always use **pnpm**, not npm.
- Quote the project path because of the space in the folder name.
- TypeScript build errors are ignored in production builds (`ignoreBuildErrors: true` in `next.config.mjs`).

## License

Private project.
