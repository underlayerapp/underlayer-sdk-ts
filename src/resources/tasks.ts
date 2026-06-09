import type createClient from "openapi-fetch";
import type { paths } from "../generated/schema.js";
import { UnderlayerApiError } from "../errors.js";
import type {
  Task,
  PaginatedList,
  ListTasksParams,
  CreateTaskParams,
  UpdateTaskParams,
} from "../types.js";

type Client = ReturnType<typeof createClient<paths>>;

/**
 * Unwrap an openapi-fetch response, throwing {@link UnderlayerApiError} on failure.
 */
async function unwrap<T>(promise: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  const { data, error, response } = await promise;
  if (!response.ok || error) {
    throw new UnderlayerApiError(response.status, (error ?? {}) as any);
  }
  return data as T;
}

/**
 * Scheduled tasks (one-time webhooks).
 *
 * @example
 * ```ts
 * const tasks = await client.tasks.list({ page: 1, pageSize: 20 });
 * console.log(tasks.items); // Task[]
 * ```
 */
export class TasksResource {
  /** @internal */
  constructor(private readonly _client: Client) {}

  /**
   * List scheduled tasks with optional filters.
   */
  async list(params: ListTasksParams = {}): Promise<PaginatedList<Task>> {
    const raw = await unwrap(
      this._client.GET("/api/v1/scheduler/tasks", {
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
            task_id: params.taskId,
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
   * Schedule a new one-time task.
   *
   * @returns The ID of the created task.
   *
   * @example
   * ```ts
   * const { id } = await client.tasks.create({
   *   name: "send-welcome-email",
   *   targetUrl: "https://api.example.com/webhooks/email",
   *   executeAt: "2026-06-10T12:00:00Z",
   *   payload: JSON.stringify({ userId: "u_123" }),
   * });
   * ```
   */
  async create(params: CreateTaskParams): Promise<{ id: string }> {
    const raw = await unwrap(
      this._client.POST("/api/v1/scheduler/tasks", {
        body: {
          name: params.name,
          target_url: params.targetUrl,
          execute_at: params.executeAt,
          payload: params.payload,
          method: params.method,
          tenant_id: params.tenantId,
          outbound_header_ids: params.outboundHeaderIds,
        },
      }),
    );
    return { id: raw.id! };
  }

  /**
   * Update a scheduled task.
   */
  async update(taskId: string, _params: UpdateTaskParams): Promise<Task> {
    // The OpenAPI spec currently has no request body on PATCH;
    // the raw client still sends the path param correctly.
    return unwrap(
      this._client.PATCH("/api/v1/scheduler/tasks/{taskId}", {
        params: { path: { taskId } },
      }),
    );
  }

  /**
   * Delete a scheduled task.
   */
  async delete(taskId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/scheduler/tasks/{taskId}", {
        params: { path: { taskId } },
      }),
    );
  }
}


