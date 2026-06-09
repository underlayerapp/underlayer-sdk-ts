import createClient from "openapi-fetch";
import type { paths } from "./generated/schema.js";
export type UnderlayerClientOptions = {
  baseUrl: string;
  apiKey?: string;
  fetch?: typeof globalThis.fetch;
  headers?: HeadersInit;
};
export function createUnderlayerClient(options: UnderlayerClientOptions) {
  const headers = new Headers(options.headers);
  if (options.apiKey) {
    headers.set("X-Api-Key", options.apiKey);
  }
  return createClient<paths>({
    baseUrl: options.baseUrl.replace(/\/$/, ""),
    headers,
    fetch: options.fetch,
  });
}
