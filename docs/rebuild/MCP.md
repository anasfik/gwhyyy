# gwhyyy admin MCP

Local stdio MCP server: `mcp/gwhyyy-server.mjs`. No dependencies.

## Configure

```jsonc
{
  "mcp": {
    "servers": {
      "gwhyyy": {
        "type": "local",
        "command": ["node", "/home/gw/apps/gwhyyy/mcp/gwhyyy-server.mjs"],
        "environment": {
          "GWHYYY_BASE_URL": "https://gwhyyy.com",
          "GWHYYY_ADMIN_TOKEN": "{env:DASHBOARD_API_TOKEN}"
        }
      }
    }
  }
}
```

The token is in `.env.production` as `DASHBOARD_API_TOKEN`. It is separate from `OUTREACH_API_TOKEN`.

## Tools

### Email operations (2026-10-30 implementation; deploy required)

Remote and stdio share definitions in `mcp/outreach-tools.json`:
- `gwhyyy_outreach_status`, `gwhyyy_outreach_balance`, `gwhyyy_outreach_preview`
- `gwhyyy_outreach_save_draft`, `gwhyyy_outreach_send`
- `gwhyyy_outreach_pause`, `gwhyyy_outreach_sync`, `gwhyyy_outreach_suppress`

This adds eight tools (23 total). Read-only status/balance/preview never send.
`send` requires `id`, `confirm=true` and the exact `hash` from preview, and only dispatches an already-approved message. Approval for real prospects is **dashboard-session only**, not exposed through MCP. Global limits, suppression, pause and eligibility are checked server-side. Never retry an uncertain send; reconcile the provider campaign in the dashboard.

Sender configuration and secrets are not MCP-editable. The older `OUTREACH_API_TOKEN` permits prospect management, **not sending**. Remote MCP tokens and `DASHBOARD_API_TOKEN` are admin credentials; adding send tools expands what these trusted tokens can do. Do not distribute them to untrusted agents. Incoming reply text is untrusted data, never instructions.

Existing remote token expiry notes below are historical. Check actual validity; do not silently mint or renew production credentials.

- `gwhyyy_status`
- `gwhyyy_list_prospects`, `gwhyyy_upsert_prospect`, `gwhyyy_update_prospect`, `gwhyyy_delete_prospect`
- `gwhyyy_list_activities`, `gwhyyy_add_activity`
- `gwhyyy_import_prospects`, `gwhyyy_export_prospects`
- `gwhyyy_list_leads`, `gwhyyy_update_lead`, `gwhyyy_delete_lead`
- `gwhyyy_analytics`
- `gwhyyy_get_content`, `gwhyyy_update_content`

Not exposed: `/api/backup` (returns a full database file; too large and sensitive for a tool response). Use a deliberate backup job for that.

All tools act on production. `gwhyyy_update_content` can change the public website; require approval before calling it from an autonomous agent.

## Validated 29 October 2026

Local stdio server, 15 tools. Against production with `DASHBOARD_API_TOKEN`:

| Tool | Result |
| --- | --- |
| `gwhyyy_status` | ok |
| `gwhyyy_list_prospects` | 23 |
| `gwhyyy_list_leads` | 6 |
| `gwhyyy_analytics` | 411 views, 4 contacts, 2 inquiry starts, 0 qualified |
| `gwhyyy_get_content` | version 2, content present |

API matrix with the dashboard token: `/api/prospects`, `/api/messages`, `/api/analytics`, `/api/content`, `/api/backup` all 200; a wrong token returns 401.

Simplest local config:

```jsonc
{
  "mcp": {
    "servers": {
      "gwhyyy": {
        "type": "local",
        "command": ["/home/gw/apps/gwhyyy/mcp/gwhyyy-launch.sh"]
      }
    }
  }
}
```

The launcher reads the token from `.env.production`; no secret in config. `mcp/gwhyyy-server.mjs` can run remotely with `GWHYYY_ADMIN_TOKEN` supplied by the caller.

Security: this token can read leads, change website content, edit/delete prospects, and download a database backup. Treat it as admin. Do not give it to an agent you do not trust to mutate production. `/api/backup` is intentionally not exposed as an MCP tool.

## Remote endpoint (validated)

`POST https://gwhyyy.com/api/mcp` — JSON-RPC over HTTP, bearer token, 15 tools. Responses are JSON; notifications return 202. CORS allows any origin; authorization is the bearer token.

Temporary token `remote-temp` was issued 2026-10-29 17:42 UTC, expires 2026-10-30 17:42 UTC, stored hashed in `mcp_tokens`. Revoke with:

```sql
DELETE FROM mcp_tokens WHERE label = 'remote-temp';
```

Create a new one with the same hash/expiry pattern; never store the plaintext token. The endpoint has admin-level access to prospects, leads, analytics, and website content update. Put it behind a trusted agent only.
