# StaffHub — Nursing Home Workforce Management

HIPAA-compliant staff hiring, onboarding, and scheduling platform with SmartLinx integration.

## Features

### Employee Onboarding Portal
- **Fillable forms** hosted on-site: Personal Info, W-4/I-9 tax forms, Direct Deposit, Training Videos, Policy Acknowledgment
- **Multi-session support** — data auto-saves every 30 seconds, employees can close and resume later
- **Submit to admin** — completed paperwork goes to an admin review queue
- **Admin uploads to SmartLinx** after reviewing submitted documents

### Scheduling
- **2-week schedule view** pulled from SmartLinx
- **Rotation-based scheduling** — supports 8-hour and 12-hour shifts
- **PRN vs Scheduled** — configure each employee's schedule type
- **Auto-populate** — rotation pattern (days on/days off) fills in future schedule automatically
- **Staffing grid** — shows slots per role: CNA (2-10), CMA (1-6), RN (1-3), LPN (1-3)

### Shift Management
- **Open shift board** with role-specific slot counts
- **Push notifications** — notify selected staff about open shifts
- **Cancel shifts** with automatic notification to affected employees

### Admin Tools
- **Send invites** via email to prospective hires
- **Filter employees** by status: Invited, Filling Forms, Awaiting Review, Active
- **Document review queue** — review submitted onboarding docs, then upload to SmartLinx
- **Onboarding flow builder** — drag-and-drop to reorder, add documents/videos/links

### Access Control
- **Super Admin** — manages admin accounts, billing, all features
- **Admin** — employees, scheduling, shifts, onboarding, billing
- **Employee** — schedule view only (after onboarding)
- **New Hire** — onboarding portal only (homescreen is paperwork until complete)

### HIPAA Compliance
- PHI/PII field encryption notices (AES-256 at rest, TLS 1.3 in transit)
- Session auto-lock after 15 min inactivity
- Role-based access control (minimum necessary principle)
- Audit trail stubs for PHI access
- No PHI in URLs

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or later
- npm (comes with Node.js)

### Install & Run

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/staffhub.git
cd staffhub

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app opens at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

Output goes to `dist/` — deploy to any static host (Vercel, Netlify, etc).

## Demo Roles

On the login screen, select a role to explore:

| Role | Experience |
|------|-----------|
| **Super Admin** | Full access — accounts, billing, all admin tools |
| **Admin** | Employee management, scheduling, shifts, onboarding |
| **Employee** | 2-week schedule view |
| **New Hire** | Fillable onboarding paperwork → schedule after approval |

## SmartLinx Integration

SmartLinx does not expose a public API. The app includes an abstraction layer (`SLX` object in `src/App.jsx`) with mock API calls. In production, work with SmartLinx's implementation team to connect via their partner integration pathway (SFTP, webhooks, or custom API).

Integration points:
- `SLX.syncEmployee()` — push approved employee data to SmartLinx
- `SLX.fetchSchedule()` — pull schedule data from SmartLinx
- `SLX.cancelShift()` — cancel a shift in SmartLinx
- `SLX.notify()` — trigger push notifications via SmartLinx Go

## Project Structure

```
staffhub/
├── index.html          # HTML entry point
├── package.json        # Dependencies & scripts
├── vite.config.js      # Vite build config
├── .gitignore
├── README.md
└── src/
    ├── main.jsx        # React mount point
    └── App.jsx         # Entire application (single-file)
```

## Tech Stack

- **React 18** — UI framework
- **Vite** — build tool & dev server
- **Outfit** — typography (Google Fonts)
- **Pure CSS** — no UI library dependencies

## License

Proprietary. All rights reserved.
