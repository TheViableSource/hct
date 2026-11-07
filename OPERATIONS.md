# Private website forms: operations

## Scope and deployment gate

Newsletter, community, and get-involved submissions stay on this server. There
is no Mailchimp/Formspree connection, outbound mail, payment capture, public
submission viewer, admin account, or public download endpoint. Donation form
IDs are rejected. Sponsorship/donation interest on the inquiry form is only an
inquiry, never a payment or pledge. Existing nonprofit and EIN claims were not
verified or changed by this work.

## Verified server architecture (2026-11-07)

Node **22.23 or newer** is required for built-in `node:sqlite`. The canonical
Plesk application uses Node **25.9**, application user **admi**, and `server.js`
with Passenger. The local development runtime is 22.23. SQLite is experimental
in these Node versions. There is no native addon or additional dependency.

- Canonical origin: `https://hillsborocivictheatre.com`.
- Application root: `/var/www/vhosts/tvssites.com/hillsborocivictheatre.com`.
- Plesk document root: `/hillsborocivictheatre.com/public`, resolving to
  `/var/www/vhosts/tvssites.com/hillsborocivictheatre.com/public`.
- Separate Plesk Git clone: `https://github.com/TheViableSource/hct.git`, branch
  `main`, deployed to the canonical application root. Source deployment is
  automatic when pulled; no post-deploy actions are configured. Build and
  Passenger restart are separate required steps.
- Old application root `/var/www/vhosts/tvssites.com/hctj.tvssites.com` remains
  untouched as a rollback resource until the canonical application is verified.
- Default Plesk public assets (`css`, `favicon`, `img`, `index`, and `test`) were
  moved recoverably to
  `/var/www/vhosts/tvssites.com/private/hct-plesk-placeholder-20261107`.

The approved private layout has been created:

| Path under `/var/www/vhosts/tvssites.com/private` | Mode | Purpose |
| --- | --- | --- |
| Parent `private` directory | 0700 | Private administration area |
| `hct-submissions` | 0700 | Live SQLite directory |
| `hct-submissions/submissions.sqlite` | 0600 | Initialized private store |
| `hct-backups` | 0700 | Consistent snapshots, separate from live data |
| `hct-exports` | 0700 | Private review and newsletter CSV exports |
| `hct-backups/hct-initial-20261107.sqlite` | 0600 | Initial consistent backup |

The initial store integrity check passed with **0 rows**. These are setup
observations, not a claim that the canonical build or live release passed.
At this documentation checkpoint the canonical build was running; build
completion, restart, and live verification remain separate release checks.
Do not recreate or reinitialize the production store, overwrite the initial
backup, or insert real personal information for testing.

The private directories are outside public/application/deployment/Git roots.
Keep them there. Runtime checks reject the current application tree, symlink
path components, unsafe writable parents, and target ownership/mode errors,
but cannot discover every Plesk vhost alias. Never expose private paths through
a new vhost, alias, public symlink or download route. Files must belong to the
application user, be ordinary files rather than symlinks/hardlinks, and have
0600 permissions. The directory must be 0700. Incorrect permissions fail
closed; the application does not silently repair them.

## Runtime configuration and release checks

The canonical application's server-only Plesk runtime settings are:

```
HCT_FORM_DATA_DIR=/var/www/vhosts/tvssites.com/private/hct-submissions
HCT_FORM_ORIGINS=https://hillsborocivictheatre.com
```

The origin allowlist is **canonical only**. Do not add the old staging host or
www host. No trailing slash, path, wildcard, or NEXT_PUBLIC_ prefix belongs in
these values. Restart the canonical Passenger application after approved
runtime configuration changes.

Use existing authenticated Plesk administration as `admi`, from the canonical
application root. Check the private store with the explicit CLI wrapper below.
`diagnose` prints only cwd, Node version, configured path and safe
ownership/permission/readiness booleans. `check` and `counts` show integrity and
aggregate counts without individual submissions.

For an authorized release, validate the locked dependencies, run typecheck and
synthetic tests, complete the production build, then run the compiled smoke
test against its isolated temporary store. Source deployment alone does not
build or restart Passenger. Test scripts use `example.invalid` entries, a free
OS-selected loopback port and isolated temporary storage; never point test data
at the production store. Verify the canonical application after restart,
including public routes, disabled donation controls and form UI. Use private
admin diagnostics/counts rather than reading real submissions. Browser QA is
not replaced by automated tests.

## Plesk command console: explicit private-store wrapper

**Verified behavior:** the Plesk Node command console does not inherit the
application UI's environment variables. A direct diagnostic returned
`configuredPath: null`. Use the wrapper below, which sets only the non-secret
private storage path within the command's Node process. It does not change the
web application's configuration. No environment dump is needed.

Full terminal command, from the canonical application root:

```sh
npm exec --offline -- node --input-type=module -e 'process.env.HCT_FORM_DATA_DIR="/var/www/vhosts/tvssites.com/private/hct-submissions";process.argv=["node","scripts/forms-admin.mjs","check"];await import("./scripts/forms-admin.mjs")'
```

In Plesk's Node command field, the UI already supplies `npm`. Enter the same
command **starting with `exec`**, not `npm exec`:

```sh
exec --offline -- node --input-type=module -e 'process.env.HCT_FORM_DATA_DIR="/var/www/vhosts/tvssites.com/private/hct-submissions";process.argv=["node","scripts/forms-admin.mjs","check"];await import("./scripts/forms-admin.mjs")'
```

For `diagnose`, replace the `"check"` argument with `"diagnose"`. For counts:

```sh
exec --offline -- node --input-type=module -e 'process.env.HCT_FORM_DATA_DIR="/var/www/vhosts/tvssites.com/private/hct-submissions";process.argv=["node","scripts/forms-admin.mjs","counts"];await import("./scripts/forms-admin.mjs")'
```

The subsequent export/backup examples use this **Plesk command-field** format.
Add the `npm` prefix only when running them in a normal terminal. Use a fresh,
meaningful timestamp in every output filename. Output files are created
exclusively; existing files are never overwritten.

`init` is a provisioning command, not a recurring maintenance step. The live
store is already initialized. For a separately authorized new empty store,
init accepts only an empty version-0 database or the known version-1 schema;
unknown versions and unrelated schemas fail unchanged. Do not run it to repair
or replace an existing production database.

## How intake behaves

The POST endpoint requires an exact configured Origin and rejects cross-site
Fetch Metadata. It exposes no CORS headers. GET is not an intake operation.
Origin checking is a browser defense, not authentication or a bot-proof gate.
A hidden honeypot, strict allowlist/type/enum/length validation, and a 16 KiB
streamed-body limit reduce abuse. No raw IP address is collected or trusted;
proxy trust has not been verified.

SQLite `BEGIN IMMEDIATE`, a 5-second lock timeout, unique request IDs, and
persistent counts protect concurrent processes/vhosts sharing the same store.
The limits are 5 accepted forms per normalized email per rolling hour, and
100 accepted forms globally per rolling hour. Retries with the identical UUID
and normalized payload succeed without another row or another rate-limit slot.
Reusing a UUID with changed data returns 409. Client buttons are locked during
requests; failed network requests retain the UUID so retries cannot duplicate a
committed submission. Invalid requests do not create rows. Limits can still be
exhausted by malicious clients; monitor availability through admin counts.

Storage stops at 10,000 submissions or 128 MiB of immediate directory entries.
SQLite also caps the database at 32,768 pages (128 MiB at its new-database 4 KiB
page size). Rollback journals and snapshots need additional free disk space;
allow at least 512 MiB plus backup/export retention. This is a bounded intake,
not an automatic retention policy. Do not put backup archives in the live data
directory. When full, the endpoint returns unavailable without claiming success.

Each accepted record has a server UUID/time, validated fields, form type,
server-defined source path, explicit newsletter boolean, consent timestamp only
when true, and the exact consent text/version. Request UUID and payload digest
support idempotency; there is no stored IP. SQLite uses DELETE journaling and
FULL synchronous commits. HTTP success follows successful commit. Database
errors and validation responses do not contain submitted fields or stack traces.
Do not enable request-body logging in reverse proxies, APM or diagnostics.

## Review and download using existing authenticated Plesk

Use the counts wrapper above for aggregate status. Create approved private
exports in the existing owner-only sibling `hct-exports` directory. Replace
`YYYYMMDD-HHMMSS` with a fresh timestamp:

```sh
exec --offline -- node --input-type=module -e 'process.env.HCT_FORM_DATA_DIR="/var/www/vhosts/tvssites.com/private/hct-submissions";process.argv=["node","scripts/forms-admin.mjs","export","/var/www/vhosts/tvssites.com/private/hct-exports/review-YYYYMMDD-HHMMSS.csv"];await import("./scripts/forms-admin.mjs")'
exec --offline -- node --input-type=module -e 'process.env.HCT_FORM_DATA_DIR="/var/www/vhosts/tvssites.com/private/hct-submissions";process.argv=["node","scripts/forms-admin.mjs","export-newsletter","/var/www/vhosts/tvssites.com/private/hct-exports/newsletter-YYYYMMDD-HHMMSS.csv"];await import("./scripts/forms-admin.mjs")'
```

These files are created exclusively as 0600 and never overwrite existing files.
CSV headers are fixed, every cell quoted, embedded quotes escaped, and dangerous
formula prefixes (including leading whitespace/control characters) neutralized.
The newsletter export excludes consent=false entries. Review exports contain
personal information. Download only through existing authenticated Plesk File
Manager from the verified private directory. Never copy to public, Git, email,
or a public link to make downloading easier. If that Plesk role cannot access
the path, ask the authorized administrator rather than weakening permissions.
Keep exports local/private and limit retention; do not upload them elsewhere
without approval. Failed exports/backups may leave an incomplete 0600 output;
do not use it, and choose a fresh filename after resolving the error.

The application user and existing privileged Plesk administrators can access
these files. Other apps running as the same `admi` Unix user are **not isolated**
from them. 0700/0600 do not protect against that user or privileged admins.

## Consistent backup and restore

Create a consistent SQLite snapshot, even if other processes are submitting:

Use the existing owner-only sibling `hct-backups` directory, never the live
`hct-submissions` directory. Replace `YYYYMMDD-HHMMSS` with a fresh timestamp;
do not overwrite `hct-initial-20261107.sqlite`.

```sh
exec --offline -- node --input-type=module -e 'process.env.HCT_FORM_DATA_DIR="/var/www/vhosts/tvssites.com/private/hct-submissions";process.argv=["node","scripts/forms-admin.mjs","backup","/var/www/vhosts/tvssites.com/private/hct-backups/hct-YYYYMMDD-HHMMSS.sqlite"];await import("./scripts/forms-admin.mjs")'
```

The approved backup directory must be 0700 and owned by the app user. The file
is new, exclusive, 0600, checked with SQLite integrity_check and fsynced. Download
only through authenticated Plesk as above. Never copy just a live SQLite file
while writes may occur; a rollback journal can be needed for recovery.

Restore only with approved admin access and a planned maintenance window:

1. Stop **all** Passenger app instances/vhosts using this store so no writes
   occur. Keep the current directory intact for rollback, including any journal.
2. Choose a fresh approved private 0700 restore directory owned by the app user.
   Do not initialize a blank store there. Place the verified snapshot there as
   `submissions.sqlite`, owner app user, mode 0600. Never overwrite a live store.
3. Set the wrapper's explicit HCT_FORM_DATA_DIR to the approved restore
   directory and run `check`.
   Verify expected aggregate counts and schema version. Do not proceed on errors.
4. Change the approved Plesk runtime setting to that restore directory, restart
   all instances, and confirm diagnose/check and form availability. Note that
   records after the backup timestamp are absent. Retain the original directory
   until recovery is approved, so those records can be reconciled privately.

No automated delete, purge, restore-overwrite or withdrawal endpoint is exposed.
Before connecting a future mailing program, implement/reconcile withdrawal and
suppression tracking, deduplicate addresses, verify consent against current
withdrawals, choose retention periods, and get authorization to transmit data.
A public checkbox records consent evidence, but does not verify that the person
owns the email address. Before mailing, confirm address ownership with a
double-opt-in flow and reconcile withdrawals. A true checkbox alone must not
override a later withdrawal. This release saves
consent; it does not send mail or claim an unsubscribe workflow is integrated.

## Rollback and failure handling

Keep private storage out of deployment cleanup and Git. Never delete it during
code rollback. On config/permissions/disk/lock errors forms fail closed with a
plain retry message. Do not loosen storage permissions or fall back to public
files or external services. Check config, filesystem space, locks and aggregate
limits privately. No PII should be pasted into logs or support reports.

The preserved old application root is a rollback resource, not proof that its
forms meet the current requirements. Leave it untouched until canonical
verification is complete. Do not redirect traffic back without checking the
form behavior and obtaining approval for the rollback.

The prior commit `deb3dc3` used a placeholder external Formspree form. Rolling
back to it would re-enable that client path and the donation intent UI. Prefer
a maintenance build with forms disabled, retaining this backend's server-side
donation rejection. A rollback of this backend must include explicit disabled
forms and removal of old Formspree posting, not just a blind Git reset. Rebuild
and restart all Passenger instances after any code rollback. Restore data only
using the separate approved procedure above; code rollback never requires it.
