// ── Main client ─────────────────────────────────────────────────────────────
export { Underlayer } from "./underlayer.js";
export type { UnderlayerOptions } from "./underlayer.js";

// ── Resource classes ────────────────────────────────────────────────────────
export { TasksResource } from "./resources/tasks.js";
export { CronJobsResource } from "./resources/cronJobs.js";
export { EventsResource } from "./resources/events.js";
export { ExecutionsResource } from "./resources/executions.js";
export { RunsResource } from "./resources/runs.js";
export { WorkspacesResource } from "./resources/workspaces.js";
export { OrganizationsResource } from "./resources/organizations.js";
export { UsersResource } from "./resources/users.js";
export { InvitesResource } from "./resources/invites.js";

// ── Errors ──────────────────────────────────────────────────────────────────
export { UnderlayerApiError } from "./errors.js";

// ── Types ───────────────────────────────────────────────────────────────────
export type {
  Task,
  CronJob,
  CronJobMutation,
  CronJobStatus,
  Execution,
  ApiError,
  HttpMethod,
  TaskStatus,
  DlqRetryTree,
  DlqRetryNode,
  PaginatedList,
  ListTasksParams,
  CreateTaskParams,
  UpdateTaskParams,
  ListCronJobsParams,
  CreateCronJobParams,
  UpdateCronJobParams,
  PublishEventParams,
  PublishEventResult,
  ListExecutionsParams,
  RetryDeadTaskParams,
  RetryDeadTaskResult,
} from "./types.js";

export type {
  ListRunsParams,
  GetRunLogsParams,
  ListRunErrorGroupsParams,
  GetRunsSummaryParams,
} from "./resources/runs.js";

// ── Legacy: low-level openapi-fetch client ──────────────────────────────────
export { createUnderlayerClient } from "./client.js";
export type { UnderlayerClientOptions } from "./client.js";

// ── Raw generated types (escape hatch) ──────────────────────────────────────
export type { paths, components, operations } from "./generated/schema.js";
