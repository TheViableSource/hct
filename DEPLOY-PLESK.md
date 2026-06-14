# Deploying HCT to Plesk (Node.js / Passenger)

Plesk runs Node apps through Phusion Passenger, which launches a single
**startup file**. This repo includes `server.js` for exactly that — it boots the
production Next.js build and listens on the port Passenger provides.

## Prerequisites

- Plesk with the **Node.js** extension installed.
- **Node.js 18.17+** selected for the domain (Next.js 14 requires it).
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
| **Node.js version** | 18.17+ (or newer LTS) |
| **Application Mode** | `production` |
| **Application Root** | the folder containing `package.json` (e.g. `/httpdocs`) |
| **Application Startup File** | `server.js` |
| **Document Root** | `/httpdocs/public` (or leave the domain default) |

### 3. Set the build-time environment variable
Before building, add the Formspree ID under **Custom environment variables**:

```
NEXT_PUBLIC_FORMSPREE_ID = your_real_formspree_id
```

> ⚠️ `NEXT_PUBLIC_*` values are baked in at **build time**, so this must be set
> *before* you run the build in the next step. If you change it later, rebuild.

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
- **Forms don't deliver:** `NEXT_PUBLIC_FORMSPREE_ID` was missing/wrong at build
  time. Set it (step 3) and rebuild.
- `npm start` and `node server.js` are equivalent here — both run `server.js`.
