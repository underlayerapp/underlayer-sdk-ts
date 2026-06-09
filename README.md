# @underlayer-app/sdk

Official TypeScript SDK for the [Underlayer](https://underlayer.dev) API — fully typed methods, zero config.

> 📚 Full API documentation: [docs.underlayer.dev](https://docs.underlayer.dev)

## Install

```bash
npm install @underlayer-app/sdk
```

## Quick start

```ts
import { Underlayer } from "@underlayer-app/sdk";

const client = new Underlayer({
  apiKey: "ul_live_xxx",
});
```

## Tasks — One-time scheduled webhooks

```ts
// List tasks with pagination and filters
const tasks = await client.tasks.list({
  page: 1,
  pageSize: 20,
  status: "pending",
  search: "welcome",
});
console.log(tasks.items);   // Task[]
console.log(tasks.total);   // number

// Schedule a task
const { id } = await client.tasks.create({
  name: "send-welcome-email",
  targetUrl: "https://api.example.com/webhooks/email",
  executeAt: "2026-06-10T12:00:00Z",
  payload: JSON.stringify({ userId: "u_123" }),
  method: "post",
});

// Update a task
await client.tasks.update(id, { name: "updated-name" });

// Delete a task
await client.tasks.delete(id);
```

## Cron Jobs — Recurring scheduled webhooks

```ts
// List cron jobs
const jobs = await client.cronJobs.list({ page: 1, pageSize: 10 });

// Create a cron job
const job = await client.cronJobs.create({
  name: "daily-sync",
  cronExpression: "0 8 * * *",
  targetUrl: "https://api.example.com/webhooks/sync",
  timezone: "Europe/Madrid",
  method: "post",
  payload: JSON.stringify({ full: true }),
});
console.log(job.id);            // string
console.log(job.nextExecuteAt); // string (ISO-8601)

// Pause / resume
await client.cronJobs.pause(job.id);
await client.cronJobs.resume(job.id);

// Update a cron job
await client.cronJobs.update(job.id, { cronExpression: "0 9 * * *" });

// Delete a cron job
await client.cronJobs.delete(job.id);
```

## Events — Fan-out to webhook subscriptions

```ts
const result = await client.events.publish({
  topic: "order.created",
  payload: { orderId: "o_123", amount: 99.90 },
});
console.log(result.taskIds);      // string[] — IDs of enqueued deliveries
console.log(result.fanOutGroupId); // string | null
```

## Executions — Recent dispatch attempts

```ts
// List recent executions (activity feed)
const executions = await client.executions.list({
  minutesAgo: 60,
  isSuccess: false,
  includeDetails: true,
});

// Retry a dead task with an edited payload
const retry = await client.executions.retryDeadTask("task-id", {
  payload: { correctedField: "value" },
});
console.log(retry.newTaskId);

// Get the retry tree for a dead-letter task
const tree = await client.executions.getRetryTree("task-id");
```

## Runs — Detailed activity, logs, error groups & exports

```ts
// List runs with advanced filtering
const runs = await client.runs.list({
  minutesAgo: 1440,
  statuses: ["failed"],
  source: "cron",
  includeTotal: true,
});

// Get run details
const detail = await client.runs.get("execution-id");

// Get logs for a run
const logs = await client.runs.getLogs("execution-id", {
  levels: ["error", "warning"],
  onlyExceptions: true,
});

// Error groups aggregated by fingerprint
const errorGroups = await client.runs.listErrorGroups({
  minutesAgo: 1440,
});

// Summary stats (totals, failure rate)
const summary = await client.runs.getSummary({ minutesAgo: 1440 });
console.log(summary.failure_rate);

// Async export
const exportJob = await client.runs.exportAsync({
  format: "csv",
  filter: { statuses: ["failed"] },
});
const status = await client.runs.getExportJob(exportJob.job_id!);
```

## Workspaces — Management

```ts
// List workspaces
const workspaces = await client.workspaces.list();

// Pause / resume workspace scheduler
await client.workspaces.pause("workspace-id");
await client.workspaces.resume("workspace-id");

// Clone a workspace
await client.workspaces.clone("workspace-id", {
  name: "staging-copy",
  options: { include_cron_jobs: true, include_environment_variables: true },
});

// API Keys
const keys = await client.workspaces.listApiKeys("workspace-id");
const newKey = await client.workspaces.createApiKey("workspace-id", {
  name: "CI Pipeline",
  expires_in: "90d",
});
console.log(newKey.key); // shown only once!
await client.workspaces.revokeApiKey("workspace-id", "key-id");

// Environment Variables
const envVars = await client.workspaces.listEnvVars("workspace-id");
await client.workspaces.createEnvVar("workspace-id", {
  key: "AUTH_TOKEN",
  value: "secret",
  description: "Backend auth token",
});

// Outbound Headers
const headers = await client.workspaces.listOutboundHeaders("workspace-id");

// Members
const members = await client.workspaces.listMembers("workspace-id");
await client.workspaces.inviteMember("workspace-id", {
  email: "teammate@example.com",
  role: "member",
});

// Activity Saved Views
const views = await client.workspaces.listActivityViews("workspace-id");

// Integrations
const integrations = await client.workspaces.getIntegrations("workspace-id");

// Dispatch Failure Alert Rules
const rules = await client.workspaces.listAlertRules("workspace-id");
```

## Organizations

```ts
const orgs = await client.organizations.list();
const org = await client.organizations.get("org-id");

// Members
const members = await client.organizations.listMembers("org-id");
await client.organizations.inviteMember("org-id", {
  email: "new@example.com",
  role: "member",
});
await client.organizations.removeMember("org-id", "user-id");

// Policy
const policy = await client.organizations.getPolicy("org-id");
```

## Users — Current user profile

```ts
const profile = await client.users.getProfile();
const pendingInvites = await client.users.listPendingInvitations();
```

## Invitations

```ts
const preview = await client.invites.preview("invite-token");
await client.invites.accept("invite-token");
```

## Error handling

```ts
import { Underlayer, UnderlayerApiError } from "@underlayer-app/sdk";

const client = new Underlayer({ apiKey: "ul_live_xxx" });

try {
  await client.tasks.delete("nonexistent-id");
} catch (err) {
  if (err instanceof UnderlayerApiError) {
    console.error(err.status);      // 404
    console.error(err.body.detail);  // "Task not found"
    console.error(err.body.code);    // error code (if any)
  }
}
```

## Advanced: low-level client

If you need full control over raw HTTP paths, you can use the underlying `openapi-fetch` client:

```ts
import { createUnderlayerClient } from "@underlayer-app/sdk";

const raw = createUnderlayerClient({
  baseUrl: "https://api.underlayer.dev",
  apiKey: "ul_live_xxx",
});

const { data, error } = await raw.GET("/api/v1/scheduler/tasks", {
  params: { query: { page: 1, page_size: 20 } },
});
```

## All available resources

| Resource | Methods | Description |
|---|---|---|
| `client.tasks` | `list`, `create`, `update`, `delete` | One-time scheduled webhooks |
| `client.cronJobs` | `list`, `create`, `update`, `delete`, `pause`, `resume` | Recurring cron jobs |
| `client.events` | `publish` | Fan-out event publishing |
| `client.executions` | `list`, `retryDeadTask`, `getRetryTree` | Dispatch attempts & DLQ |
| `client.runs` | `list`, `get`, `getLogs`, `listErrorGroups`, `getSummary`, `exportSync`, `exportAsync`, `getExportJob`, `downloadExport`, `downloadExportWithToken` | Detailed run history & exports |
| `client.workspaces` | `list`, `update`, `delete`, `clone`, `pause`, `resume`, `listApiKeys`, `createApiKey`, `revokeApiKey`, `listEnvVars`, `createEnvVar`, `updateEnvVar`, `deleteEnvVar`, `listOutboundHeaders`, `createOutboundHeader`, `updateOutboundHeader`, `deleteOutboundHeader`, `listMembers`, `updateMember`, `lookupUsers`, `listPendingInvitations`, `inviteMember`, `sendInvitation`, `inviteMembersBatch`, `revokeInvitationByToken`, `listActivityViews`, `createActivityView`, `updateActivityView`, `deleteActivityView`, `getIntegrations`, `upsertIntegrations`, `upsertWhatsAppIntegration`, `deleteWhatsAppIntegration`, `deleteTelegramIntegration`, `listAlertRules`, `createAlertRule`, `updateAlertRule`, `deleteAlertRule`, `listAlertRuleChannels`, `createAlertRuleChannel`, `updateAlertRuleChannel`, `deleteAlertRuleChannel` | Workspace management |
| `client.organizations` | `list`, `get`, `update`, `delete`, `listMembers`, `removeMember`, `listInvitations`, `inviteMember`, `revokeInvitation`, `leave`, `getPolicy`, `updatePolicy` | Organization management |
| `client.users` | `getProfile`, `updateProfile`, `deleteAccount`, `listPendingInvitations` | Current user account |
| `client.invites` | `preview`, `accept` | Invitation flow |

## Requirements

- Node.js 18+
- Works in any runtime with `fetch` (Node, Bun, Deno, Cloudflare Workers, browsers)

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT
