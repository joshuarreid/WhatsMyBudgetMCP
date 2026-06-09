# WhatsMyBudgetMCP

TypeScript MCP server for the WhatsMyBudget Analytics API (`/api/analytics`) built with FastMCP.

## What changed

- MCP infrastructure migrated to `fastmcp`
- Existing API integration/business logic preserved
- Tool names, descriptions, and response payload shapes preserved
- Tool registration split into modular files for easier future additions

## Requirements

- Node.js 20+
- npm

## Environment variables

Copy `.env.example` to `.env` and set values:

- `WMB_API_BASE_URL` (example: `https://api.example.com`)
- `WMB_BEARER_TOKEN` (optional; sent only when set)
- `WMB_TIMEOUT_MS` (optional, default `15000`)
- `WMB_TRANSPORT` (optional: `stdio` or `httpStream`; default auto-detect)
- `PORT` (optional; when set, server defaults to `httpStream` on this port)
- `WMB_HTTP_HOST` (optional; default `0.0.0.0` for `httpStream`)

## Project structure

```text
src/
  index.ts
  server.ts
  config.ts
  schemas/
    analytics.ts
  services/
    apiClient.ts
    auth.ts
  tools/
    index.ts
    registerApiTool.ts
    analytics/
      registerMetadataTools.ts
      registerPeriodTools.ts
      registerRangeTools.ts
      registerSummaryTools.ts
    health/
      registerHealthTool.ts
```

## Local setup (development)

1. Clone and enter the project.
2. Create your local env file.
3. Install dependencies.
4. Build and run tests.
5. Run the MCP server over stdio.

```bash
cp .env.example .env
```

```bash
npm install
```

```bash
npm run build
```

```bash
npm test
```

```bash
npm run dev
```

Optional smoke check (calls `GET /api/analytics/periods`):

```bash
npm run smoke
```

Production runtime command (compiled):

```bash
npm run build
```

```bash
npm start
```

## Exposed MCP tools

- `analytics_health`
- `analytics_periods_list`
- `analytics_categories_distinct_global`
- `analytics_period_overview`
- `analytics_period_categories`
- `analytics_period_categories_distinct`
- `analytics_period_categories_top`
- `analytics_period_accounts`
- `analytics_period_payment_methods`
- `analytics_period_criticality`
- `analytics_period_daily`
- `analytics_period_duplicates`
- `analytics_period_uncategorized`
- `analytics_period_outliers`
- `analytics_range_overview`
- `analytics_range_categories`
- `analytics_range_categories_top`
- `analytics_range_accounts`
- `analytics_range_payment_methods`
- `analytics_range_criticality`
- `analytics_range_daily`
- `analytics_range_duplicates`
- `analytics_range_uncategorized`
- `analytics_range_outliers`
- `analytics_summary_by_period`
- `analytics_summaries_range`

## Production setup on DigitalOcean

This server supports both MCP `stdio` and `httpStream` transports.

- If `PORT` is set at runtime, it starts `httpStream` on `0.0.0.0:$PORT`.
- Otherwise it defaults to `stdio` for local process-based MCP clients.

### Option A: DigitalOcean Droplet (recommended for stdio)

Use this when your agent runs on the same Droplet and launches this MCP server as a local process.

1. Provision an Ubuntu Droplet.
2. Install Node.js 20+ and npm.
3. Clone the repo and configure env vars.
4. Build and run as a long-lived process.

Example commands after SSH:

```bash
git clone <your-repo-url>
```

```bash
cd WhatsMyBudgetMCP
```

```bash
cp .env.example .env
```

```bash
npm install
```

```bash
npm run build
```

```bash
npm start
```

For process supervision in production, use a service manager like `systemd` or PM2.

### Option B: Docker on Droplet

If your agent can execute Docker commands locally on the host, run the MCP server in a container.

```bash
docker build -t whatsmybudget-mcp:latest .
```

```bash
docker run --rm \
  -e WMB_API_BASE_URL="https://api.example.com" \
  -e WMB_TIMEOUT_MS="15000" \
  whatsmybudget-mcp:latest
```

If your backend enforces auth, include `-e WMB_BEARER_TOKEN="your-token"`.

### App Platform note

DigitalOcean App Platform can run this server when `PORT` is injected by the platform (default behavior). The server will bind to `0.0.0.0:$PORT` and expose MCP at `/mcp` with health at `/health`.
