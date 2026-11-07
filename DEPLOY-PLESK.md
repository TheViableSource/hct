# Deploying HCT to Plesk (Node.js / Passenger)

Plesk runs Node apps through Phusion Passenger, which launches a single
**startup file**. This repo includes `server.js` for exactly that — it boots the
production Next.js build and listens on the port Passenger provides.

## Prerequisites

- Plesk with the **Node.js** extension installed.
- **Node.js 22.23+** selected for the domain (required for built-in SQLite).
- The site files in the domain (via Git pull or upload — see step 1).

## Steps

### 1. Get the code onto the server
Either:
- **Git (recommended):** In Plesk → domain → **Git**, clone
  `git@github.com:TheViableSource/hct.git` (or the HTTPS URL) into the domain.
  Enable "Deploy automatically" for push-to-deploy if you like.
- **Upload:** Zip the repo (excluding `node_modules` and `.next`) and upload it
  to the domain's directory.

### 2. Enable Node.js for the domain
Plesk → domain → **Node.js**, then set:

| Field | Value |
|-------|-------|
| **Node.js version** | 22.23+ (or newer LTS) |
| **Application Mode** | `production` |
| **Application Root** | the folder containing `package.json` (e.g. `/httpdocs`) |
| **Application Startup File** | `server.js` |
| **Document Root** | `/httpdocs/public` (or leave the domain default) |

### 3. Set up private form storage

Follow [OPERATIONS.md](OPERATIONS.md) first. The server-only runtime settings are
`HCT_FORM_DATA_DIR` and `HCT_FORM_ORIGINS`. There is no Formspree connection.
Initialize the private SQLite store as the application user before enabling forms.
Do not place data in the application root, public root, Git, or deployment tree.
Restart every Passenger app instance after changing runtime settings.

### 4. Install dependencies
Click **NPM Install** in the Node.js panel (runs `npm install`).

### 5. Build the production bundle
In the Node.js panel, use **Run Script** → enter `build` (runs `npm run build`).
This creates the `.next` production build. Wait for it to finish.

### 6. Start it
Click **Restart App** (or **Enable Node.js**). Passenger launches `server.js`,
which serves the built site. Visit the domain to confirm.

## Redeploying after changes

1. `git pull` (or re-upload changed files).
2. **NPM Install** (only if dependencies changed).
3. **Run Script → `build`**.
4. **Restart App**.

## Notes & troubleshooting

- **`.next` and `node_modules` are not in git** (by design). They're generated on
  the server by steps 4–5. Don't upload them.
- **500 on first hit after restart:** Next needs a second to warm up after
  Passenger starts the process; reload once.
- **App won't start / "startup file not found":** confirm Application Root points
  at the folder with `package.json` and Startup File is exactly `server.js`.
- **Old content after deploy:** you forgot to re-run **build**, or Passenger is
  serving a cached process — hit **Restart App**.
- **Forms return unavailable:** use the private `forms:admin diagnose` and `check` commands from OPERATIONS.md. Check runtime settings, initialized storage, permissions, disk space, and rate/storage limits. No email delivery is configured.
- `npm start` and `node server.js` are equivalent here — both run `server.js`.
