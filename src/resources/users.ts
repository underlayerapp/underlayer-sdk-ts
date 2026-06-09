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

/** Current user profile and account management. */
export class UsersResource {
  /** @internal */
  constructor(private readonly _client: Client) {}

  /** Get the current user's profile. */
  async getProfile() {
    return unwrap(this._client.GET("/api/v1/users/me"));
  }

  /** Update the current user's profile. */
  async updateProfile() {
    return unwrap(this._client.PATCH("/api/v1/users/me"));
  }

  /** Delete the current user's account. */
  async deleteAccount(): Promise<void> {
    await unwrap(this._client.DELETE("/api/v1/users/me"));
  }

  /** List pending workspace invitations for the current user. */
  async listPendingInvitations() {
    return unwrap(this._client.GET("/api/v1/users/me/pending-workspace-invitations"));
  }
}

