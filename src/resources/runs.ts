import type createClient from "openapi-fetch";
import type { paths, components } from "../generated/schema.js";
import { UnderlayerApiError } from "../errors.js";

type Client = ReturnType<typeof createClient<paths>>;

async function unwrap<T>(promise: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  const { data, error, response } = await promise;
  if (!response.ok || error) {
    throw new UnderlayerApiError(response.status, (error ?? {}) as any);
  }
  return data as T;
}

export interface ListRunsParams {
  page?: number;
  pageSize?: number;
  from?: string;
  to?: string;
  minutesAgo?: number;
  statuses?: string[];
  outcomes?: string[];
  hasRetries?: boolean;
  source?: string;
  scheduledTaskId?: string;
  cronJobId?: string;
  tenantId?: string;
  search?: string;
  windowField?: string;
  errorFingerprint?: string;
  sort?: string;
  order?: string;
  includeTotals?: boolean;
  includeTotal?: boolean;
}

export interface GetRunLogsParams {
  page?: number;
  pageSize?: number;
  levels?: string[];
  onlyExceptions?: boolean;
  search?: string;
}

export interface ListRunErrorGroupsParams {
  from?: string;
  to?: string;
  minutesAgo?: number;
  statuses?: string[];
  outcomes?: string[];
  source?: string;
  scheduledTaskId?: string;
  cronJobId?: string;
  tenantId?: string;
  hasRetries?: boolean;
  search?: string;
  windowField?: string;
  errorFingerprint?: string;
  limit?: number;
}

export interface GetRunsSummaryParams {
  from?: string;
  to?: string;
  minutesAgo?: number;
  statuses?: string[];
  outcomes?: string[];
  hasRetries?: boolean;
  source?: string;
  scheduledTaskId?: string;
  cronJobId?: string;
  tenantId?: string;
  search?: string;
  windowField?: string;
  errorFingerprint?: string;
}

/** Scheduler runs (activity history, logs, error groups, exports). */
export class RunsResource {
  /** @internal */
  constructor(private readonly _client: Client) {}

  /** List scheduler runs with filtering and pagination. */
  async list(params: ListRunsParams = {}) {
    return unwrap(
      this._client.GET("/api/v1/scheduler/runs", {
        params: {
          query: {
            page: params.page,
            page_size: params.pageSize,
            from: params.from,
            to: params.to,
            minutes_ago: params.minutesAgo,
            statuses: params.statuses,
            outcomes: params.outcomes,
            has_retries: params.hasRetries,
            source: params.source,
            scheduled_task_id: params.scheduledTaskId,
            cron_job_id: params.cronJobId,
            tenant_id: params.tenantId,
            search: params.search,
            window_field: params.windowField,
            error_fingerprint: params.errorFingerprint,
            sort: params.sort,
            order: params.order,
            include_totals: params.includeTotals,
            include_total: params.includeTotal,
          },
        },
      }),
    );
  }

  /** Get detailed information about a specific run. */
  async get(executionId: string) {
    return unwrap(
      this._client.GET("/api/v1/scheduler/runs/{executionId}", {
        params: { path: { executionId } },
      }),
    );
  }

  /** List logs for a specific run. */
  async getLogs(executionId: string, params: GetRunLogsParams = {}) {
    return unwrap(
      this._client.GET("/api/v1/scheduler/runs/{executionId}/logs", {
        params: {
          path: { executionId },
          query: {
            page: params.page,
            page_size: params.pageSize,
            levels: params.levels,
            only_exceptions: params.onlyExceptions,
            search: params.search,
          },
        },
      }),
    );
  }

  /** List error groups aggregated by fingerprint. */
  async listErrorGroups(params: ListRunErrorGroupsParams = {}) {
    return unwrap(
      this._client.GET("/api/v1/scheduler/runs/error-groups", {
        params: {
          query: {
            from: params.from,
            to: params.to,
            minutes_ago: params.minutesAgo,
            statuses: params.statuses,
            outcomes: params.outcomes,
            source: params.source,
            scheduled_task_id: params.scheduledTaskId,
            cron_job_id: params.cronJobId,
            tenant_id: params.tenantId,
            has_retries: params.hasRetries,
            search: params.search,
            window_field: params.windowField,
            error_fingerprint: params.errorFingerprint,
            limit: params.limit,
          },
        },
      }),
    );
  }

  /** Get a summary of scheduler runs (totals, failure rate, etc.). */
  async getSummary(params: GetRunsSummaryParams = {}) {
    return unwrap(
      this._client.GET("/api/v1/scheduler/runs/summary", {
        params: {
          query: {
            from: params.from,
            to: params.to,
            minutes_ago: params.minutesAgo,
            statuses: params.statuses,
            outcomes: params.outcomes,
            has_retries: params.hasRetries,
            source: params.source,
            scheduled_task_id: params.scheduledTaskId,
            cron_job_id: params.cronJobId,
            tenant_id: params.tenantId,
            search: params.search,
            window_field: params.windowField,
            error_fingerprint: params.errorFingerprint,
          },
        },
      }),
    );
  }

  /** Export runs synchronously (webhook delivery). */
  async exportSync(body: components["schemas"]["ExecuteSchedulerRunsSyncExportRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/scheduler/runs/export", { body }),
    );
  }

  /** Enqueue an async export job. */
  async exportAsync(body: components["schemas"]["EnqueueSchedulerRunsExportRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/scheduler/runs/exports", { body }),
    );
  }

  /** Get the status of an export job. */
  async getExportJob(jobId: string) {
    return unwrap(
      this._client.GET("/api/v1/scheduler/runs/exports/{jobId}", {
        params: { path: { jobId } },
      }),
    );
  }

  /** Download a completed export. */
  async downloadExport(jobId: string) {
    return unwrap(
      this._client.GET("/api/v1/scheduler/runs/exports/{jobId}/download", {
        params: { path: { jobId } },
      }),
    );
  }

  /** Download an export using a signed token. */
  async downloadExportWithToken(token: string) {
    return unwrap(
      this._client.GET("/api/v1/scheduler/runs/exports/download", {
        params: { query: { token } },
      }),
    );
  }
}

