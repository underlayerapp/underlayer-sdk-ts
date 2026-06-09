import type createClient from "openapi-fetch";
import type { paths } from "../generated/schema.js";
import { UnderlayerApiError } from "../errors.js";
import type {
  CronJob,
  CronJobMutation,
  PaginatedList,
  ListCronJobsParams,
  CreateCronJobParams,
  UpdateCronJobParams,
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
 * Recurring cron jobs.
 *
 * @example
 * ```ts
 * const jobs = await client.cronJobs.list();
 * await client.cronJobs.pause(jobs.items[0].id!);
 * ```
 */
export class CronJobsResource {
  /** @internal */
  constructor(private readonly _client: Client) {}

  /**
   * List cron jobs with optional filters.
   */
  async list(params: ListCronJobsParams = {}): Promise<PaginatedList<CronJob>> {
    const raw = await unwrap(
      this._client.GET("/api/v1/scheduler/cronjobs", {
        params: {
          query: {
            page: params.page,
            page_size: params.pageSize,
            sort: params.sort,
            order: params.order,
            tenant_id: params.tenantId,
            search: params.search,
            method: params.method,
            status: params.status,
            created_within_minutes: params.createdWithinMinutes,
            cron_job_id: params.cronJobId,
          },
        },
      }),
    );
    return {
      items: raw.items ?? [],
      total: raw.total ?? 0,
      page: raw.page ?? 1,
      pageSize: raw.page_size ?? 20,
    };
  }

  /**
   * Create a new cron job.
   *
   * @returns The ID and next execution time.
   *
   * @example
   * ```ts
   * const job = await client.cronJobs.create({
   *   name: "daily-sync",
   *   cronExpression: "0 8 * * *",
   *   targetUrl: "https://api.example.com/webhooks/sync",
   *   timezone: "Europe/Madrid",
   * });
   * ```
   */
  async create(params: CreateCronJobParams): Promise<{ id: string; nextExecuteAt: string }> {
    const raw = await unwrap(
      this._client.POST("/api/v1/scheduler/cronjobs", {
        body: {
          name: params.name,
          cron_expression: params.cronExpression,
          target_url: params.targetUrl,
          payload: params.payload,
          timezone: params.timezone,
          method: params.method,
          tenant_id: params.tenantId,
          outbound_header_ids: params.outboundHeaderIds,
        },
      }),
    );
    return { id: raw.id!, nextExecuteAt: raw.next_execute_at! };
  }

  /**
   * Update a cron job.
   */
  async update(cronJobId: string, _params: UpdateCronJobParams): Promise<CronJob> {
    return unwrap(
      this._client.PATCH("/api/v1/scheduler/cronjobs/{cronJobId}", {
        params: { path: { cronJobId } },
      }),
    );
  }

  /**
   * Delete a cron job.
   */
  async delete(cronJobId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/scheduler/cronjobs/{cronJobId}", {
        params: { path: { cronJobId } },
      }),
    );
  }

  /**
   * Pause a cron job. It will not execute until resumed.
   */
  async pause(cronJobId: string): Promise<CronJobMutation> {
    return unwrap(
      this._client.POST("/api/v1/scheduler/cronjobs/{cronJobId}/pause", {
        params: { path: { cronJobId } },
      }),
    );
  }

  /**
   * Resume a paused cron job.
   */
  async resume(cronJobId: string): Promise<CronJobMutation> {
    return unwrap(
      this._client.POST("/api/v1/scheduler/cronjobs/{cronJobId}/resume", {
        params: { path: { cronJobId } },
      }),
    );
  }
}


