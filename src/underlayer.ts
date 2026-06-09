import createClient from "openapi-fetch";
import type { paths } from "./generated/schema.js";
import { TasksResource } from "./resources/tasks.js";
import { CronJobsResource } from "./resources/cronJobs.js";
import { EventsResource } from "./resources/events.js";
import { ExecutionsResource } from "./resources/executions.js";
import { RunsResource } from "./resources/runs.js";
import { WorkspacesResource } from "./resources/workspaces.js";
import { OrganizationsResource } from "./resources/organizations.js";
import { UsersResource } from "./resources/users.js";
import { InvitesResource } from "./resources/invites.js";

const DEFAULT_BASE_URL = "https://api.underlayer.dev";

export interface UnderlayerOptions {
  /**
   * Your workspace API key (starts with `ul_live_` or `ul_test_`).
   */
  apiKey: string;

  /**
   * Base URL of the Underlayer API. Defaults to `https://api.underlayer.dev`.
   */
  baseUrl?: string;

  /**
   * Custom `fetch` implementation (useful for testing or edge runtimes).
   */
  fetch?: typeof globalThis.fetch;

  /**
   * Additional headers sent with every request.
   */
  headers?: Record<string, string>;
}

/**
 * Underlayer SDK client.
 *
 * @example
 * ```ts
 * import { Underlayer } from "@underlayer-app/sdk";
 *
 * const client = new Underlayer({ apiKey: "ul_live_xxx" });
 *
 * // Schedule a one-time webhook
 * const { id } = await client.tasks.create({
 *   name: "send-email",
 *   targetUrl: "https://api.example.com/webhooks/email",
 *   executeAt: "2026-06-10T12:00:00Z",
 * });
 *
 * // List cron jobs
 * const jobs = await client.cronJobs.list({ page: 1, pageSize: 10 });
 *
 * // Publish an event
 * await client.events.publish({ topic: "order.created", payload: { orderId: "123" } });
 * ```
 */
export class Underlayer {
  // ── Core Scheduling ───────────────────────────────────────────────────

  /** Scheduled tasks (one-time webhooks). */
  readonly tasks: TasksResource;

  /** Recurring cron jobs. */
  readonly cronJobs: CronJobsResource;

  /** Event publishing (fan-out). */
  readonly events: EventsResource;

  /** Execution history (recent dispatch attempts) & dead-letter queue. */
  readonly executions: ExecutionsResource;

  /** Scheduler runs (detailed activity, logs, error groups, exports). */
  readonly runs: RunsResource;

  // ── Management ────────────────────────────────────────────────────────

  /** Workspace management (CRUD, API keys, env vars, members, etc.). */
  readonly workspaces: WorkspacesResource;

  /** Organization management (members, invitations, policies). */
  readonly organizations: OrganizationsResource;

  /** Current user profile and account. */
  readonly users: UsersResource;

  /** Workspace invitation preview and acceptance. */
  readonly invites: InvitesResource;

  constructor(options: UnderlayerOptions) {
    const headers = new Headers(options.headers);
    headers.set("X-Api-Key", options.apiKey);

    const httpClient = createClient<paths>({
      baseUrl: (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/$/, ""),
      headers,
      fetch: options.fetch,
    });

    this.tasks = new TasksResource(httpClient);
    this.cronJobs = new CronJobsResource(httpClient);
    this.events = new EventsResource(httpClient);
    this.executions = new ExecutionsResource(httpClient);
    this.runs = new RunsResource(httpClient);
    this.workspaces = new WorkspacesResource(httpClient);
    this.organizations = new OrganizationsResource(httpClient);
    this.users = new UsersResource(httpClient);
    this.invites = new InvitesResource(httpClient);
  }
}
