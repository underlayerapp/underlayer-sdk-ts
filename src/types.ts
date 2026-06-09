import type { components } from "./generated/schema.js";

// ── Entity types ────────────────────────────────────────────────────────────

/** A single scheduled task (one-time webhook). */
export type Task = components["schemas"]["TaskListItemDto"];

/** A recurring cron job. */
export type CronJob = components["schemas"]["CronJobListItemDto"];

/** Result of pausing/resuming a cron job. */
export type CronJobMutation = components["schemas"]["CronJobMutationResponse"];

/** A single HTTP dispatch attempt (activity feed). */
export type Execution = components["schemas"]["RecentDispatchAttemptDto"];

/** API error body (RFC 9457 subset). */
export type ApiError = components["schemas"]["ApiErrorBody"];

/** Webhook HTTP methods. */
export type HttpMethod = components["schemas"]["WebhookHttpMethod"];

/** Task status. */
export type TaskStatus = components["schemas"]["ScheduledTaskStatus"];

/** Cron job status. */
export type CronJobStatus = components["schemas"]["CronJobStatus"];

/** DLQ retry tree. */
export type DlqRetryTree = components["schemas"]["DlqTaskRetryTreeDto"];

/** DLQ retry node. */
export type DlqRetryNode = components["schemas"]["DlqTaskRetryNodeDto"];

// ── Paginated response ──────────────────────────────────────────────────────

export interface PaginatedList<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ── Request parameter types ─────────────────────────────────────────────────

export interface ListTasksParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: string;
  tenantId?: string;
  search?: string;
  method?: string;
  status?: string;
  createdWithinMinutes?: number;
  taskId?: string;
}

export interface CreateTaskParams {
  name: string;
  targetUrl: string;
  executeAt: string;
  payload?: string | null;
  method?: HttpMethod;
  tenantId?: string | null;
  outboundHeaderIds?: string[] | null;
}

export interface UpdateTaskParams {
  name?: string;
  targetUrl?: string;
  executeAt?: string;
  payload?: string | null;
  method?: HttpMethod;
  tenantId?: string | null;
  outboundHeaderIds?: string[] | null;
}

export interface ListCronJobsParams {
  page?: number;
  pageSize?: number;
  sort?: string;
  order?: string;
  tenantId?: string;
  search?: string;
  method?: string;
  status?: string;
  createdWithinMinutes?: number;
  cronJobId?: string;
}

export interface CreateCronJobParams {
  name: string;
  cronExpression: string;
  targetUrl: string;
  payload?: string | null;
  timezone?: string;
  method?: HttpMethod;
  tenantId?: string | null;
  outboundHeaderIds?: string[] | null;
}

export interface UpdateCronJobParams {
  name?: string;
  cronExpression?: string;
  targetUrl?: string;
  payload?: string | null;
  timezone?: string;
  method?: HttpMethod;
  tenantId?: string | null;
  outboundHeaderIds?: string[] | null;
}

export interface PublishEventParams {
  topic: string;
  payload?: unknown;
  targetUrl?: unknown;
  tenantId?: string | null;
}

export interface PublishEventResult {
  taskIds: string[];
  fanOutGroupId: string | null;
}

export interface ListExecutionsParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  minutesAgo?: number;
  since?: string;
  until?: string;
  afterId?: string;
  isSuccess?: boolean;
  source?: string;
  scheduledTaskId?: string;
  cronJobId?: string;
  tenantId?: string;
  includeTotal?: boolean;
  includeDetails?: boolean;
}

export interface RetryDeadTaskParams {
  payload?: unknown;
  targetUrl?: string | null;
}

export interface RetryDeadTaskResult {
  originalTaskId: string;
  newTaskId: string;
}

