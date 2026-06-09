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

/**
 * Workspace management — CRUD, members, API keys, environment variables,
 * outbound headers, invitations, activity views, integrations, and alert rules.
 *
 * Most methods require a `workspaceId` parameter.
 */
export class WorkspacesResource {
  /** @internal */
  constructor(private readonly _client: Client) {}

  // ── Workspace CRUD ──────────────────────────────────────────────────────

  /** List workspaces the current user belongs to. */
  async list() {
    return unwrap(this._client.GET("/api/v1/workspaces"));
  }

  /** Update workspace settings. */
  async update(workspaceId: string) {
    return unwrap(
      this._client.PATCH("/api/v1/workspaces/{workspaceId}", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Delete a workspace permanently. */
  async delete(workspaceId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Clone a workspace and its configuration. */
  async clone(workspaceId: string, body: components["schemas"]["CloneWorkspaceRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/clone", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Pause the workspace scheduler. */
  async pause(workspaceId: string): Promise<void> {
    await unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/pause", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Resume the workspace scheduler. */
  async resume(workspaceId: string): Promise<void> {
    await unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/resume", {
        params: { path: { workspaceId } },
      }),
    );
  }

  // ── API Keys ────────────────────────────────────────────────────────────

  /** List API keys for a workspace. */
  async listApiKeys(workspaceId: string) {
    return unwrap(
      this._client.GET("/api/v1/workspaces/{workspaceId}/api-keys", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Create a new API key for a workspace. */
  async createApiKey(workspaceId: string, body: components["schemas"]["CreateApiKeyRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/api-keys", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Revoke an API key. */
  async revokeApiKey(workspaceId: string, keyId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}/api-keys/{keyId}", {
        params: { path: { workspaceId, keyId } },
      }),
    );
  }

  // ── Environment Variables ───────────────────────────────────────────────

  /** List environment variables for a workspace. */
  async listEnvVars(workspaceId: string) {
    return unwrap(
      this._client.GET("/api/v1/workspaces/{workspaceId}/environment-variables", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Create an environment variable. */
  async createEnvVar(workspaceId: string, body: components["schemas"]["CreateEnvironmentVariableRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/environment-variables", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Update an environment variable. */
  async updateEnvVar(workspaceId: string, variableId: string) {
    return unwrap(
      this._client.PATCH("/api/v1/workspaces/{workspaceId}/environment-variables/{variableId}", {
        params: { path: { workspaceId, variableId } },
      }),
    );
  }

  /** Delete an environment variable. */
  async deleteEnvVar(workspaceId: string, variableId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}/environment-variables/{variableId}", {
        params: { path: { workspaceId, variableId } },
      }),
    );
  }

  // ── Outbound Headers ────────────────────────────────────────────────────

  /** List outbound header templates. */
  async listOutboundHeaders(workspaceId: string) {
    return unwrap(
      this._client.GET("/api/v1/workspaces/{workspaceId}/outbound-headers", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Create an outbound header template. */
  async createOutboundHeader(workspaceId: string, body: components["schemas"]["CreateOutboundHeaderRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/outbound-headers", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Update an outbound header template. */
  async updateOutboundHeader(workspaceId: string, headerId: string, body: components["schemas"]["PatchOutboundHeaderRequest"]) {
    return unwrap(
      this._client.PATCH("/api/v1/workspaces/{workspaceId}/outbound-headers/{headerId}", {
        params: { path: { workspaceId, headerId } },
        body,
      }),
    );
  }

  /** Delete an outbound header template. */
  async deleteOutboundHeader(workspaceId: string, headerId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}/outbound-headers/{headerId}", {
        params: { path: { workspaceId, headerId } },
      }),
    );
  }

  // ── Members ─────────────────────────────────────────────────────────────

  /** List workspace members. */
  async listMembers(workspaceId: string) {
    return unwrap(
      this._client.GET("/api/v1/workspaces/{workspaceId}/members", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Update a workspace member's role. */
  async updateMember(workspaceId: string, userId: string, body: components["schemas"]["PatchWorkspaceMemberRequest"]) {
    return unwrap(
      this._client.PATCH("/api/v1/workspaces/{workspaceId}/members/{userId}", {
        params: { path: { workspaceId, userId } },
        body,
      }),
    );
  }

  /** Lookup workspace users by email. */
  async lookupUsers(workspaceId: string, body: components["schemas"]["LookupWorkspaceUsersRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/users/lookup", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  // ── Invitations ─────────────────────────────────────────────────────────

  /** List pending workspace invitations. */
  async listPendingInvitations(workspaceId: string) {
    return unwrap(
      this._client.GET("/api/v1/workspaces/{workspaceId}/invitations", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Invite a member to a workspace. */
  async inviteMember(workspaceId: string, body: components["schemas"]["SendInviteRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/invitations", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Send a workspace invitation (alternate endpoint). */
  async sendInvitation(workspaceId: string, body: components["schemas"]["SendInviteRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/invites", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Batch invite members to a workspace. */
  async inviteMembersBatch(workspaceId: string, body: components["schemas"]["InviteWorkspaceMembersBatchRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/invites/batch", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Revoke a pending invitation by token. */
  async revokeInvitationByToken(workspaceId: string, token: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}/invitations/{token}", {
        params: { path: { workspaceId, token } },
      }),
    );
  }

  // ── Activity Saved Views ────────────────────────────────────────────────

  /** List activity saved views. */
  async listActivityViews(workspaceId: string) {
    return unwrap(
      this._client.GET("/api/v1/workspaces/{workspaceId}/activity-views", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Create an activity saved view. */
  async createActivityView(workspaceId: string, body: components["schemas"]["CreateActivitySavedViewRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/activity-views", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Update an activity saved view. */
  async updateActivityView(workspaceId: string, viewId: string) {
    return unwrap(
      this._client.PATCH("/api/v1/workspaces/{workspaceId}/activity-views/{viewId}", {
        params: { path: { workspaceId, viewId } },
      }),
    );
  }

  /** Delete an activity saved view. */
  async deleteActivityView(workspaceId: string, viewId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}/activity-views/{viewId}", {
        params: { path: { workspaceId, viewId } },
      }),
    );
  }

  // ── Integrations ────────────────────────────────────────────────────────

  /** Get workspace integrations status. */
  async getIntegrations(workspaceId: string) {
    return unwrap(
      this._client.GET("/api/v1/workspaces/{workspaceId}/integrations", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Upsert workspace integrations. */
  async upsertIntegrations(workspaceId: string, body: components["schemas"]["UpsertWorkspaceIntegrationsRequest"]) {
    return unwrap(
      this._client.PUT("/api/v1/workspaces/{workspaceId}/integrations", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Upsert WhatsApp integration. */
  async upsertWhatsAppIntegration(workspaceId: string, body: components["schemas"]["UpsertWorkspaceWhatsAppIntegrationRequest"]) {
    return unwrap(
      this._client.PUT("/api/v1/workspaces/{workspaceId}/integrations/whatsapp", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Delete WhatsApp integration. */
  async deleteWhatsAppIntegration(workspaceId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}/integrations/whatsapp", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Delete Telegram integration. */
  async deleteTelegramIntegration(workspaceId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}/integrations/telegram", {
        params: { path: { workspaceId } },
      }),
    );
  }

  // ── Dispatch Failure Alert Rules ────────────────────────────────────────

  /** List dispatch failure alert rules. */
  async listAlertRules(workspaceId: string) {
    return unwrap(
      this._client.GET("/api/v1/workspaces/{workspaceId}/dispatch-failure-alert-rules", {
        params: { path: { workspaceId } },
      }),
    );
  }

  /** Create a dispatch failure alert rule. */
  async createAlertRule(workspaceId: string, body: components["schemas"]["WriteDispatchFailureAlertRuleRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/dispatch-failure-alert-rules", {
        params: { path: { workspaceId } },
        body,
      }),
    );
  }

  /** Update a dispatch failure alert rule. */
  async updateAlertRule(workspaceId: string, ruleId: string, body: components["schemas"]["WriteDispatchFailureAlertRuleRequest"]) {
    return unwrap(
      this._client.PATCH("/api/v1/workspaces/{workspaceId}/dispatch-failure-alert-rules/{ruleId}", {
        params: { path: { workspaceId, ruleId } },
        body,
      }),
    );
  }

  /** Delete a dispatch failure alert rule. */
  async deleteAlertRule(workspaceId: string, ruleId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}/dispatch-failure-alert-rules/{ruleId}", {
        params: { path: { workspaceId, ruleId } },
      }),
    );
  }

  /** List channels for a dispatch failure alert rule. */
  async listAlertRuleChannels(workspaceId: string, ruleId: string) {
    return unwrap(
      this._client.GET("/api/v1/workspaces/{workspaceId}/dispatch-failure-alert-rules/{ruleId}/channels", {
        params: { path: { workspaceId, ruleId } },
      }),
    );
  }

  /** Create a channel for a dispatch failure alert rule. */
  async createAlertRuleChannel(workspaceId: string, ruleId: string, body: components["schemas"]["WriteDispatchFailureAlertRuleChannelRequest"]) {
    return unwrap(
      this._client.POST("/api/v1/workspaces/{workspaceId}/dispatch-failure-alert-rules/{ruleId}/channels", {
        params: { path: { workspaceId, ruleId } },
        body,
      }),
    );
  }

  /** Update a channel for a dispatch failure alert rule. */
  async updateAlertRuleChannel(workspaceId: string, ruleId: string, channelId: string, body: components["schemas"]["WriteDispatchFailureAlertRuleChannelRequest"]) {
    return unwrap(
      this._client.PATCH("/api/v1/workspaces/{workspaceId}/dispatch-failure-alert-rules/{ruleId}/channels/{channelId}", {
        params: { path: { workspaceId, ruleId, channelId } },
        body,
      }),
    );
  }

  /** Delete a channel from a dispatch failure alert rule. */
  async deleteAlertRuleChannel(workspaceId: string, ruleId: string, channelId: string): Promise<void> {
    await unwrap(
      this._client.DELETE("/api/v1/workspaces/{workspaceId}/dispatch-failure-alert-rules/{ruleId}/channels/{channelId}", {
        params: { path: { workspaceId, ruleId, channelId } },
      }),
    );
  }
}










