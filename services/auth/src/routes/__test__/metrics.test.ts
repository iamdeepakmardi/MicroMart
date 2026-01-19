import request from "supertest";
import { app } from "../../app";

it("returns 200 and metrics data for /metrics", async () => {
  const response = await request(app).get("/metrics").send().expect(200);

  expect(response.text).toContain("process_cpu_user_seconds_total");
  expect(response.headers["content-type"]).toContain("text/plain");
});
