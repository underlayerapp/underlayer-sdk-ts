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

/** Organization management — CRUD, members, invitations, and policies. */
export class OrganizationsResource {
  /** @internal */
  constructor(private readonly _client: Client) {}

  /** List organizations the current user belongs to. */
  async list() {
    return unwrap(this._client.GET("/api/v1/organizations"));
  }

  /** Get organization details. */
  async get(organizationId: string) {
    return unwrap(
      this._client.GET("/api/v1/organizations/{organizationId}", {
        params: { path: { organizationId } },
      }),
    );
  }

  /** Update organization settings. */
  async update(organizationId: string) {
    return unwrap(
      this._client.PATCH("/api/v1/organizations/{organizationId}", {
        params: { path: { organizationId } },
      }),
    );
  }

  /** Delete an organization permanently. */
  async delete(organizationId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/organizations/{organizationId}", {
        params: { path: { organizationId } },
      }),
    );
  }

  /** List organization members. */
  async listMembers(organizationId: string) {
    return unwrap(
      this._client.GET("/api/v1/organizations/{organizationId}/members", {
        params: { path: { organizationId } },
      }),
    );
  }

  /** Remove a member from the organization. */
  async removeMember(organizationId: string, userId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/organizations/{organizationId}/members/{userId}", {
        params: { path: { organizationId, userId } },
      }),
    );
  }

  /** List pending organization invitations. */
  async listInvitations(organizationId: string) {
    return unwrap(
      this._client.GET("/api/v1/organizations/{organizationId}/invitations", {
        params: { path: { organizationId } },
      }),
    );
  }

  /** Invite a member to the organization. */
  async inviteMember(organizationId: string, body: components["schemas"]["InviteOrganizationMemberRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/organizations/{organizationId}/invitations", {
        params: { path: { organizationId } },
        body,
      }),
    );
  }

  /** Revoke a pending invitation by token. */
  async revokeInvitation(organizationId: string, token: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/organizations/{organizationId}/invitations/{token}", {
        params: { path: { organizationId, token } },
      }),
    );
  }

  /** Leave an organization. */
  async leave(organizationId: string): Promise<void> {
    await unwrap(
      this._client.POST("/api/v1/organizations/{organizationId}/leave", {
        params: { path: { organizationId } },
      }),
    );
  }

  /** Get organization policy. */
  async getPolicy(organizationId: string) {
    return unwrap(
      this._client.GET("/api/v1/organizations/{organizationId}/policy", {
        params: { path: { organizationId } },
      }),
    );
  }

  /** Update organization policy. */
  async updatePolicy(organizationId: string, body: components["schemas"]["PatchOrganizationPolicyRequest"]) {
    return unwrap(
      this._client.PATCH("/api/v1/organizations/{organizationId}/policy", {
        params: { path: { organizationId } },
        body,
      }),
    );
  }
}

