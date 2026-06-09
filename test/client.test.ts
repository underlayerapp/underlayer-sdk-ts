import { describe, expect, it, vi } from "vitest";
import { createUnderlayerClient } from "../src/client.js";
describe("createUnderlayerClient", () => {
  it("adds api key header when provided", async () => {
    const fetchMock = vi.fn(async () =>
      new Response(JSON.stringify({ items: [] }), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );
    const client = createUnderlayerClient({
      baseUrl: "https://api.underlayer.dev/",
      apiKey: "ul_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });
    await client.GET("/api/v1/scheduler/tasks", {
      params: { query: { page: 1, page_size: 10 } },
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = fetchMock.mock.calls[0][0] as Request;
    expect(request.headers.get("x-api-key")).toBe("ul_test_123");
  });
});
