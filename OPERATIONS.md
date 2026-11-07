# Private website forms: operations

## Scope and deployment gate

Newsletter, community, and get-involved submissions stay on this server. There
is no Mailchimp/Formspree connection, outbound mail, payment capture, public
submission viewer, admin account, or public download endpoint. Donation form
IDs are rejected. Sponsorship/donation interest on the inquiry form is only an
inquiry, never a payment or pledge. Existing nonprofit and EIN claims were not
verified or changed by this work.

Node **22.23 or newer** is required for built-in `node:sqlite`. The local runtime
is 22.23; the reported Plesk runtime is 25.9. SQLite is still experimental in these
Node versions. Verify on the actual production runtime before release. There is
no native addon or additional dependency.

The verified app root is `/var/www/vhosts/tvssites.com/hctj.tvssites.com`.
The proposed private path is `/var/www/vhosts/tvssites.com/private/hct-submissions`.
This is a proposal, NOT a directory created by this change. An authorized admin
must verify the parent, ownership, access, symlinks, available disk space, and
that no web vhost/alias serves it. Obtain required approval before creating it
or changing server permissions/configuration. Never guess a subscription home.

The directory must be outside **all** public, application, deployment and Git
roots. Runtime checks reject the current application tree, symlink path
components, unsafe writable parents, and target ownership/mode errors, but
cannot discover every Plesk vhost alias. The operator must check those.

## Approved server setup

1. Use existing authenticated Plesk administration. Verify the Node runtime,
   application root, startup file `server.js`, public document root, and app
   user `admi`. Run commands below as the application user from the app root,
   using Plesk's selected Node binary rather than an older system binary.
2. Ensure the verified private parent already exists and can be used by this
   application. The init command only creates the final directory, with 0700.
   It never recursively creates parents or repairs permissions. Init is idempotent
   for the known version-1 schema. Only a completely empty version-0 database
   may be initialized; unknown versions or unrelated schemas fail unchanged. Existing
   directory must be 0700 and owned by the process user; files must be 0600,
   owned by that user, ordinary files, not symlinks or hardlinks. Incorrect
   permissions cause failure rather than silent changes.
3. Configure these **server-only runtime** environment variables in Plesk:

   - `HCT_FORM_DATA_DIR=/var/www/vhosts/tvssites.com/private/hct-submissions`
     only after the path is verified and approved.
   - `HCT_FORM_ORIGINS=https://hillsborocivictheatre.com,https://hctj.tvssites.com`
     only for approved served origins. No trailing slashes, paths or wildcards.
     The www host should redirect to the canonical apex, not need a third entry.

   Never prefix these with NEXT_PUBLIC_. The CLI also needs these environment
   variables in its shell; Plesk web-app variables may not be inherited by its
   terminal. Do not paste any environment dump into a report.
4. Run `npm run forms:admin -- diagnose`, then
   `npm run forms:admin -- init`, then `npm run forms:admin -- check`.
   Diagnose prints only cwd, Node version, resolved configured path and safe
   ownership/permission/readiness booleans. Check/counts print aggregate counts
   and integrity status, never individual submissions.
5. Install existing locked dependencies if needed, run `npm run typecheck`,
   `npm test`, `npm run build`, then `npm run test:production`. The compiled smoke
   test uses a free OS-selected loopback port and a temporary synthetic store. Deploy only with separate release approval.
   Git source deployment does not build or restart Passenger. Restart every
   vhost/Passenger instance serving this application after build/config updates.
6. Verify the actual runtime with synthetic `example.invalid` input using a
   separate private test store, never a real person's data. Test success,
   consent false/true, disabled donation, bad origin, and a repeated request.
   Verify no form data is in public/build output. Then verify production config
   with diagnose/check without reading real submissions. Browser UI QA remains
   a release step; automated Node tests do not replace it.

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

Run `npm run forms:admin -- counts` for aggregate status.
For private review create a fresh CSV, using a separately approved 0700 directory
owned by the application user outside all served/deployed trees:

```
npm run forms:admin -- export /verified/private-export-dir/review-YYYYMMDD.csv
npm run forms:admin -- export-newsletter /verified/private-export-dir/newsletter-YYYYMMDD.csv
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

```
npm run forms:admin -- backup /verified/private-backup-dir/hct-YYYYMMDD.sqlite
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
3. Point the CLI's HCT_FORM_DATA_DIR at the restore directory and run `check`.
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

The prior commit `deb3dc3` used a placeholder external Formspree form. Rolling
back to it would re-enable that client path and the donation intent UI. Prefer
a maintenance build with forms disabled, retaining this backend's server-side
donation rejection. A rollback of this backend must include explicit disabled
forms and removal of old Formspree posting, not just a blind Git reset. Rebuild
and restart all Passenger instances after any code rollback. Restore data only
using the separate approved procedure above; code rollback never requires it.
