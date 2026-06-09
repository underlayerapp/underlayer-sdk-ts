import type createClient from "openapi-fetch";
import type { paths } from "../generated/schema.js";
import { UnderlayerApiError } from "../errors.js";
import type {
  Execution,
  ListExecutionsParams,
  DlqRetryTree,
  RetryDeadTaskParams,
  RetryDeadTaskResult,
} from "../types.js";

type Client = ReturnType<typeof createClient<paths>>;

async function unwrap<T>(promise: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  const { data, error, response } = await promise;
  if (!response.ok || error) {
    throw new UnderlayerApiError(response.status, (error ?? {}) as any);
  }
  return data as T;
}

/**
 * Execution history and dead-letter queue.
 *
 * @example
 * ```ts
 * const executions = await client.executions.list({ minutesAgo: 60 });
 * ```
 */
export class ExecutionsResource {
  /** @internal */
  constructor(private readonly _client: Client) {}

  /**
   * List recent dispatch attempts (activity feed).
   */
  async list(params: ListExecutionsParams = {}): Promise<Execution[]> {
    return unwrap(
      this._client.GET("/api/v1/scheduler/executions", {
        params: {
          query: {
            page: params.page,
            page_size: params.pageSize,
            limit: params.limit,
            minutes_ago: params.minutesAgo,
            since: params.since,
            until: params.until,
            after_id: params.afterId,
            is_success: params.isSuccess,
            source: params.source,
            scheduled_task_id: params.scheduledTaskId,
            cron_job_id: params.cronJobId,
            tenant_id: params.tenantId,
            include_total: params.includeTotal,
            include_details: params.includeDetails,
          },
        },
      }),
    );
  }

  /**
   * Retry a dead task, optionally editing its payload or target URL.
   */
  async retryDeadTask(taskId: string, params: RetryDeadTaskParams = {}): Promise<RetryDeadTaskResult> {
    const raw = await unwrap(
      this._client.POST("/api/v1/dlq/{taskId}/retry-with-edit", {
        params: { path: { taskId } },
        body: {
          payload: params.payload,
          target_url: params.targetUrl,
        },
      }),
    );
    return {
      originalTaskId: raw.original_task_id!,
      newTaskId: raw.new_task_id!,
    };
  }

  /**
   * Get the immutable retry tree for a dead-letter task.
   */
  async getRetryTree(taskId: string): Promise<DlqRetryTree> {
    return unwrap(
      this._client.GET("/api/v1/dlq/{taskId}/retry-tree", {
        params: { path: { taskId } },
      }),
    );
  }
}


