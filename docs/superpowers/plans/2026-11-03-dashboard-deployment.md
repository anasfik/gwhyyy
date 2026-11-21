# Dashboard production deployment

User requested deployment of the verified dashboard rebuild.

- [x] Inspect working tree, Docker build context, running app identity and disk capacity.
- [x] Read-only preflight: live health/public baseline, SQLite content hash and outreach settings/counts; independent volume/rollback audit.
- [x] Confirm the precise production switch immediately before deployment. User confirmed “Deploy now”.
- [x] Preserve the running image and take a consistent SQLite backup without replacing production data.
- [x] Build the application image from current verified source; do not include host QA build/environment/database.
- [x] Recreate only the app service against the existing SQLite volume; leave nginx and email settings unchanged unless routing requires a scoped reload.
- [x] Verify live health, authenticated dashboard routes and styling, public routes, unchanged content hash and email dispatch state. Record image IDs and rollback command.

No git push, content publication, email sending, provider sync, database restore/migration changes, volume deletion, or credential changes are part of this release.

## Preflight and artifacts

- Previous image: `sha256:00375f6340fbf844340f25f1991528f2a44c36fc22685ae6662018b09d44e6f3`.
- Retained rollback tag: `gwhyyy-app:pre-dashboard-20261103T130818Z`.
- Candidate tag: `gwhyyy-app:dashboard-20261103T130818Z`; Docker production build passed.
- Consistent SQLite backup: `/app/data/backups/pre-dashboard-20261103T130818Z.sqlite` on the existing volume; `quick_check=ok`, mode 0600.
- Production baseline: content v4, six projects; content hash `8fa973cef8880677546669501c5cd746b79f0117baf1d67a0de8159f4cb08a80`; dispatch paused, live mode, sender revision 4.
- Runtime environment parity check found no differing keys (values not printed). Backend/config/public-source files predate the running image; only dashboard/login/font/helper changes were newer.
- Root disk 74% used before build. Stopped the isolated QA server to free memory; no unrelated processes were stopped.
- Existing nginx uses a static upstream. Compare the app's old `172.19.0.3` IP and proxied health after switching; reload only if routing requires it.

## Switch evidence

- At 13:14 UTC the app was recreated using candidate image `sha256:ed394461de61545af937047b3b2a1be4c523bbbc274cddb87e22ef439e2c8293`.
- Docker health passed; both the local nginx proxy and `https://gwhyyy.com/api/health` returned healthy content v4.
- The mount remains `gwhyyy_sqlite_data:/app/data`; app IP remains `172.19.0.3`. No nginx restart/reload was necessary.
- Runner inspection confirmed no `.env.production`, docs or tests were included in the final image, and the new mail child route is present.

## Final live verification

- 32 authenticated browser checks passed: all 16 dashboard destinations at 1440px and 390px, HTTP 200, Manrope/workspace styling present, one main landmark and no horizontal page overflow. Zero console errors or blocked writes; theme toggle passed.
- All 20 public sitemap URLs returned HTTP 200. Sampled unauthenticated dashboard destinations redirected to login.
- Production content hash/version, public profile hash, contact/prospect counts, mail count/attempts, sender revision and dispatch state exactly match the pre-deploy baseline. Dispatch remains paused.
- `gwhyyy-app:latest` now points to the verified candidate image; the separate old rollback tag remains available.
- Final public health check at 13:18 UTC passed. App image and latest tag both resolve to `sha256:ed394461de61545af937047b3b2a1be4c523bbbc274cddb87e22ef439e2c8293`.
- Read-only browser evidence: `/tmp/opencode/dashboard-live-verification/`; private file permissions were restricted. No production content publication, record edits, email/provider actions or database restore occurred.
- Residual checks: live email sending, publication/restore and manual assistive-technology testing were deliberately not exercised. No Git commit or push was performed.

## Rollback (requires approval before use)

```bash
docker compose --project-name gwhyyy --project-directory /home/gw/apps/gwhyyy \
  -f /home/gw/apps/gwhyyy/docker-compose.yml -f - \
  up -d --no-deps --no-build --pull never --force-recreate \
  --wait --wait-timeout 180 app <<'YAML'
services:
  app:
    image: gwhyyy-app:pre-dashboard-20261103T130818Z
YAML
```

Verify image identity, health, volume and nginx routing after rollback. This restores the previous application image, not data. Do not restore the SQLite backup unless a separate approved recovery requires it.
