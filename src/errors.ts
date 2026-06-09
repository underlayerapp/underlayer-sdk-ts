import type { ApiError } from "./types.js";

/**
 * Error thrown when the Underlayer API returns a non-2xx response.
 * Includes the HTTP status code and the structured error body.
 */
export class UnderlayerApiError extends Error {
  /** HTTP status code. */
  readonly status: number;
  /** Structured error body (RFC 9457 subset). */
  readonly body: ApiError;

  constructor(status: number, body: ApiError) {
    const detail = body.detail ?? body.title ?? "Unknown API error";
    super(`Underlayer API error ${status}: ${detail}`);
    this.name = "UnderlayerApiError";
    this.status = status;
    this.body = body;
  }
}

