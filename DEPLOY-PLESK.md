# Deploying HCT to Plesk (Node.js / Passenger)

Plesk's Passenger launches `server.js`, which serves the production Next.js
build. A source pull, build and application restart are distinct operations.

## Verified canonical architecture (2026-11-07)

| Setting | Value |
| --- | --- |
| Canonical origin | `https://hillsborocivictheatre.com` |
| Node.js | 25.9 |
| Application user | `admi` |
| Application mode | `production` |
| Application root | `/var/www/vhosts/tvssites.com/hillsborocivictheatre.com` |
| Plesk document root | `/hillsborocivictheatre.com/public` |
| Startup file | `server.js` |
| Separate Git clone | `https://github.com/TheViableSource/hct.git` |
| Git branch | `main` |
| Deployment target | Canonical application root |
| Deployment mode | Automatic source deployment when pulled |
| Post-deploy actions | None |

The old `/var/www/vhosts/tvssites.com/hctj.tvssites.com` application is untouched
as a rollback resource until the canonical application is verified. Do not
reuse its application root for the canonical deployment or assume its forms
are safe to re-enable. Default Plesk public placeholder assets were moved
recoverably to
`/var/www/vhosts/tvssites.com/private/hct-plesk-placeholder-20261107`.

At this documentation checkpoint the canonical build was running. Build
completion, restart and live verification have not been claimed here.

## Private forms configuration

See [OPERATIONS.md](OPERATIONS.md) for the verified private layout, diagnostic
wrappers, private exports, consistent backups and restore/rollback procedure.
The approved production store is **already initialized**, integrity checked
with 0 rows at setup, with an initial consistent private backup. Do not recreate
it or use real submissions for testing.

Set the canonical app's server-only runtime variables to:

```
HCT_FORM_DATA_DIR=/var/www/vhosts/tvssites.com/private/hct-submissions
HCT_FORM_ORIGINS=https://hillsborocivictheatre.com
```

The origin allowlist is canonical only. There is no Formspree, mailing service,
payment processing or public admin endpoint. The live DB, exports and backups
are in separate owner-only private directories outside the deployment tree.

**Plesk's Node command console does not inherit these application UI variables.**
Use the explicit Node-process wrapper in OPERATIONS.md for admin commands. The
Plesk command field supplies the `npm` prefix; enter commands beginning with
`exec --offline -- node ...`, not `npm exec ...`. Runtime settings still need to
be set independently for the actual web application.

## Authorized redeployment

1. Confirm the intended release is on GitHub `main`, then pull the canonical
   Plesk Git repository. Its configured source deployment copies the checkout
   to the canonical application root. It does not build or restart anything.
2. Install locked dependencies when required. Node 22.23+ is the minimum for
   built-in SQLite; the selected production runtime is 25.9.
3. Run the applicable typecheck and synthetic test suite. Test data must use an
   isolated temporary store, never the production database.
4. Run `build` through Plesk's npm controls. Wait for successful completion and
   inspect the result. Do not run concurrent builds in the same app root.
5. Restart the canonical application through Plesk's Node panel. Passenger
   launches `server.js` against the completed `.next` build and runtime config.
6. Verify canonical public pages, robots/sitemap domain, disabled giving
   controls, form UI and configuration. Use the private diagnostic/check/counts
   wrappers without reading real submissions. Keep the old root untouched
   until the canonical release is verified.

## Troubleshooting

- `.next` and `node_modules` are generated, not committed. Source deployment
  alone cannot replace build/install steps.
- An unexpected Plesk default page indicates a document-root/placeholder or
  application routing issue. Confirm the canonical root and preserved
  placeholder location before changing files.
- For startup errors, check application root, `server.js`, selected Node and
  successful build output before restart. Do not report release success until
  public verification passes.
- For old content, verify the deployed commit, successful build and Passenger
  restart. Do not run another build while one is already active.
- For unavailable forms, use the explicit admin wrapper. A direct console
  command can show a missing configured path even when UI runtime variables
  are set, because the command environment is separate. Check permissions,
  storage readiness, free space and limits privately, without exposing PII.
- `npm start` and `node server.js` are equivalent. Backup/export commands use
  separate private sibling directories, never public or live DB folders.
