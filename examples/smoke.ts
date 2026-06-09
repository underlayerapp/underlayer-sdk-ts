import { createUnderlayerClient } from "../src/index.js";
async function main() {
  const client = createUnderlayerClient({
    baseUrl: process.env.UNDERLAYER_BASE_URL ?? "http://localhost:5111",
    apiKey: process.env.UNDERLAYER_API_KEY,
  });
  const { data, error, response } = await client.GET("/api/v1/scheduler/tasks", {
    params: { query: { page: 1, page_size: 5 } },
  });
  console.log("status", response.status);
  if (error) {
    console.error("error", error);
  } else {
    console.log("data", data);
  }
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});
