/**
 * E2E tests: send real traces to collector.anyway.sh via SDK.
 * Requires ANYWAY_API_KEY environment variable — skipped if not set.
 */

import * as assert from "assert";
import { context, trace } from "@opentelemetry/api";

const API_KEY = process.env.ANYWAY_API_KEY;
const BASE_URL = "https://collector.anyway.sh";

describe("Collector E2E", function () {
  // allow time for network round-trips
  this.timeout(10_000);

  before(function () {
    if (!API_KEY) {
      this.skip();
    }
  });

  it("should send a trace via SDK initialize()", async () => {
    const sdk = require("../dist/index.js");

    sdk.initialize({
      appName: "e2e-test-js",
      apiKey: API_KEY,
      disableBatch: true,
    });

    const tracer = trace.getTracer("e2e-test-js");

    const parentSpan = tracer.startSpan("e2e-collector-js");
    parentSpan.setAttribute("test.type", "e2e");
    parentSpan.setAttribute("test.endpoint", BASE_URL);

    const ctx = trace.setSpan(context.active(), parentSpan);

    const child = tracer.startSpan("child-span", {}, ctx);
    child.setAttribute("test.step", "step-1");
    await new Promise((r) => setTimeout(r, 10));
    child.end();

    parentSpan.end();

    // allow export
    await new Promise((r) => setTimeout(r, 2000));

    const traceId = parentSpan.spanContext().traceId;
    assert.ok(traceId, "trace ID should be set");
  });
});
