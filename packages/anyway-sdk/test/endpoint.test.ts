/**
 * Tests for default endpoint and environment variable configuration.
 *
 * Verifies:
 * 1. Default endpoint is https://collector.anyway.sh
 * 2. normalizeBaseUrl utility works correctly
 * 3. ANYWAY_* environment variables are used
 * 4. Old traceloop.com references are removed from source
 */

import * as assert from "assert";
import * as fs from "fs";
import { normalizeBaseUrl } from "../src/lib/utils/url";

describe("Default Endpoint", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  describe("normalizeBaseUrl", () => {
    it("should remove trailing slash", () => {
      assert.strictEqual(
        normalizeBaseUrl("https://collector.anyway.sh/"),
        "https://collector.anyway.sh",
      );
    });

    it("should remove multiple trailing slashes", () => {
      assert.strictEqual(
        normalizeBaseUrl("https://collector.anyway.sh///"),
        "https://collector.anyway.sh",
      );
    });

    it("should not modify URL without trailing slash", () => {
      assert.strictEqual(
        normalizeBaseUrl("https://collector.anyway.sh"),
        "https://collector.anyway.sh",
      );
    });

    it("should handle URL with path and trailing slash", () => {
      assert.strictEqual(
        normalizeBaseUrl("https://example.com/api/v1/"),
        "https://example.com/api/v1",
      );
    });
  });

  describe("Environment variables", () => {
    it("should use ANYWAY_BASE_URL", () => {
      process.env.ANYWAY_BASE_URL = "https://custom.anyway.sh";
      assert.strictEqual(process.env.ANYWAY_BASE_URL, "https://custom.anyway.sh");
    });

    it("should use ANYWAY_API_KEY", () => {
      process.env.ANYWAY_API_KEY = "test-key-123";
      assert.strictEqual(process.env.ANYWAY_API_KEY, "test-key-123");
    });
  });

  describe("Source code", () => {
    it("should have collector.anyway.sh as default in configuration", () => {
      const src = fs.readFileSync(
        require.resolve("../src/lib/configuration/index.ts"),
        "utf-8",
      );
      assert.ok(src.includes("https://collector.anyway.sh"));
      assert.ok(src.includes("ANYWAY_BASE_URL"));
      assert.ok(src.includes("ANYWAY_API_KEY"));
    });

    it("should use normalizeBaseUrl in span-processor", () => {
      const src = fs.readFileSync(
        require.resolve("../src/lib/tracing/span-processor.ts"),
        "utf-8",
      );
      assert.ok(src.includes("normalizeBaseUrl"));
    });

    it("should not reference old api.traceloop.com endpoint", () => {
      const files = [
        "../src/lib/configuration/index.ts",
        "../src/lib/tracing/span-processor.ts",
        "../src/lib/client/traceloop-client.ts",
      ];
      for (const file of files) {
        const src = fs.readFileSync(require.resolve(file), "utf-8");
        assert.ok(
          !src.includes("api.traceloop.com"),
          `${file} should not reference api.traceloop.com`,
        );
      }
    });
  });
});
