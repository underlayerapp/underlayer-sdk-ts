import type createClient from "openapi-fetch";
import type { paths } from "../generated/schema.js";
import { UnderlayerApiError } from "../errors.js";
import type { PublishEventParams, PublishEventResult } from "../types.js";

type Client = ReturnType<typeof createClient<paths>>;

async function unwrap<T>(promise: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  const { data, error, response } = await promise;
  if (!response.ok || error) {
    throw new UnderlayerApiError(response.status, (error ?? {}) as any);
  }
  return data as T;
}

/**
 * Event publishing (fan-out to webhook subscriptions).
 *
 * @example
 * ```ts
 * const result = await client.events.publish({
 *   topic: "order.created",
 *   payload: { orderId: "o_123", amount: 99.90 },
 * });
 * console.log(result.taskIds); // IDs of enqueued webhook deliveries
 * ```
 */
export class EventsResource {
  /** @internal */
  constructor(private readonly _client: Client) {}

  /**
   * Publish an event to enqueue webhook deliveries.
   */
  async publish(params: PublishEventParams): Promise<PublishEventResult> {
    const raw = await unwrap(
      this._client.POST("/api/events", {
        body: {
          topic: params.topic,
          payload: params.payload,
          target_url: params.targetUrl,
          tenant_id: params.tenantId,
        },
      }),
    );
    return {
      taskIds: raw.task_ids ?? [],
      fanOutGroupId: raw.fan_out_group_id ?? null,
    };
  }
}


