import { describe, expect, it, vi } from "vitest";
import { Underlayer, UnderlayerApiError } from "../src/index.js";
import { createUnderlayerClient } from "../src/client.js";

// Helper to create a mock fetch that returns a JSON response
function mockFetch(body: unknown, status = 200) {
  return vi.fn(async () =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "content-type": "application/json" },
    }),
  ) as unknown as typeof fetch;
}

describe("Underlayer SDK", () => {
  it("sends api key header on every request", async () => {
    const fetchMock = mockFetch({ items: [], total: 0, page: 1, page_size: 20 });
    const client = new Underlayer({
      baseUrl: "https://api.underlayer.dev",
      apiKey: "ul_test_123",
      fetch: fetchMock,
    });

    await client.tasks.list();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = (fetchMock as any).mock.calls[0][0] as Request;
    expect(request.headers.get("x-api-key")).toBe("ul_test_123");
  });

  it("tasks.list returns typed paginated result", async () => {
    const fetchMock = mockFetch({
      items: [{ id: "t_1", name: "test-task", status: "pending" }],
      total: 1,
      page: 1,
      page_size: 20,
    });
    const client = new Underlayer({
      baseUrl: "https://api.underlayer.dev",
      apiKey: "ul_test_123",
      fetch: fetchMock,
    });

    const result = await client.tasks.list({ page: 1, pageSize: 20 });

    expect(result.items).toHaveLength(1);
    expect(result.items[0].name).toBe("test-task");
    expect(result.total).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it("tasks.create returns task id", async () => {
    const fetchMock = mockFetch({ id: "t_new" }, 201);
    const client = new Underlayer({
      baseUrl: "https://api.underlayer.dev",
      apiKey: "ul_test_123",
      fetch: fetchMock,
    });

    const { id } = await client.tasks.create({
      name: "my-task",
      targetUrl: "https://example.com/hook",
      executeAt: "2026-06-10T12:00:00Z",
    });

    expect(id).toBe("t_new");
  });

  it("events.publish returns task ids", async () => {
    const fetchMock = mockFetch({ task_ids: ["t_1", "t_2"], fan_out_group_id: "g_1" }, 201);
    const client = new Underlayer({
      baseUrl: "https://api.underlayer.dev",
      apiKey: "ul_test_123",
      fetch: fetchMock,
    });

    const result = await client.events.publish({
      topic: "order.created",
      payload: { orderId: "123" },
    });

    expect(result.taskIds).toEqual(["t_1", "t_2"]);
    expect(result.fanOutGroupId).toBe("g_1");
  });

  it("throws UnderlayerApiError on 4xx", async () => {
    const fetchMock = mockFetch(
      { status: 404, title: "Not Found", detail: "Task not found" },
      404,
    );
    const client = new Underlayer({
      baseUrl: "https://api.underlayer.dev",
      apiKey: "ul_test_123",
      fetch: fetchMock,
    });

    await expect(client.tasks.delete("nonexistent")).rejects.toThrow(UnderlayerApiError);

    try {
      await client.tasks.delete("nonexistent");
    } catch (err) {
      expect(err).toBeInstanceOf(UnderlayerApiError);
      expect((err as UnderlayerApiError).status).toBe(404);
      expect((err as UnderlayerApiError).body.detail).toBe("Task not found");
    }
  });

  it("cronJobs.pause returns mutation response", async () => {
    const fetchMock = mockFetch({
      id: "cj_1",
      status: "paused",
      next_execute_at: "2026-06-15T08:00:00Z",
    });
    const client = new Underlayer({
      baseUrl: "https://api.underlayer.dev",
      apiKey: "ul_test_123",
      fetch: fetchMock,
    });

    const result = await client.cronJobs.pause("cj_1");

    expect(result.status).toBe("paused");
    expect(result.id).toBe("cj_1");
  });
});

// Legacy client backward compatibility
describe("createUnderlayerClient (legacy)", () => {
  it("adds api key header when provided", async () => {
    const fetchMock = mockFetch({ items: [] });
    const client = createUnderlayerClient({
      baseUrl: "https://api.underlayer.dev/",
      apiKey: "ul_test_123",
      fetch: fetchMock as unknown as typeof fetch,
    });

    await client.GET("/api/v1/scheduler/tasks", {
      params: { query: { page: 1, page_size: 10 } },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const request = (fetchMock as any).mock.calls[0][0] as Request;
    expect(request.headers.get("x-api-key")).toBe("ul_test_123");
  });
});
