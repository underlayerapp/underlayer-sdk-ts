import type createClient from "openapi-fetch";
import type { paths } from "../generated/schema.js";
import { UnderlayerApiError } from "../errors.js";

type Client = ReturnType<typeof createClient<paths>>;

async function unwrap<T>(promise: Promise<{ data?: T; error?: unknown; response: Response }>): Promise<T> {
  const { data, error, response } = await promise;
  if (!response.ok || error) {
    throw new UnderlayerApiError(response.status, (error ?? {}) as any);
  }
  return data as T;
}

/** Workspace invitation preview and acceptance. */
export class InvitesResource {
  /** @internal */
  constructor(private readonly _client: Client) {}

  /** Preview an invitation (workspace name, etc.) before accepting. */
  async preview(token: string) {
    return unwrap(
      this._client.GET("/api/v1/invites/{token}/preview", {
        params: { path: { token } },
      }),
    );
  }

  /** Accept a workspace invitation. */
  async accept(token: string) {
    return unwrap(
      this._client.POST("/api/v1/invites/{token}/accept", {
        params: { path: { token } },
      }),
    );
  }
}

