import { Underlayer, UnderlayerApiError } from "../src/index.js";

async function main() {
  const client = new Underlayer({
    baseUrl: process.env.UNDERLAYER_BASE_URL ?? "http://localhost:5111",
    apiKey: process.env.UNDERLAYER_API_KEY ?? "",
  });

  // List tasks
  const tasks = await client.tasks.list({ page: 1, pageSize: 5 });
  console.log("tasks", tasks.items.length, "/", tasks.total);

  // List cron jobs
  const jobs = await client.cronJobs.list({ page: 1, pageSize: 5 });
  console.log("cronJobs", jobs.items.length, "/", jobs.total);

  // List recent executions
  const executions = await client.executions.list({ minutesAgo: 60 });
  console.log("executions (last 60 min)", executions.length);
}

main().catch((err) => {
  if (err instanceof UnderlayerApiError) {
    console.error(`API error ${err.status}:`, err.body);
  } else {
    console.error(err);
  }
  process.exit(1);
});
