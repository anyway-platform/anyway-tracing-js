# @anyway-sh/node-server-sdk

OpenTelemetry-based observability SDK for LLM applications. Automatically instruments LLM provider calls, tracks token usage, and calculates costs.

## Installation

```bash
npm install @anyway-sh/node-server-sdk
```

## Quick Start

```typescript
import { initialize } from "@anyway-sh/node-server-sdk";

initialize({
  apiKey: process.env.ANYWAY_API_KEY,
  appName: "my-app",
});
```

## ESM / Next.js

ESM projects must pass provider modules explicitly since OpenTelemetry's require-based instrumentation doesn't work with ESM imports:

```typescript
import { initialize } from "@anyway-sh/node-server-sdk";
import * as OpenAIModule from "openai";

initialize({
  apiKey: process.env.ANYWAY_API_KEY,
  appName: "my-app",
  instrumentModules: {
    openAI: OpenAIModule.OpenAI,
  },
});
```

## Tracing Workflows

Use `withWorkflow`, `withTask`, `withAgent`, and `withTool` to create structured trace hierarchies:

```typescript
import { withWorkflow, withTask } from "@anyway-sh/node-server-sdk";

async function main() {
  await withWorkflow({ name: "my-pipeline" }, async () => {
    const result = await withTask({ name: "generate-response" }, async () => {
      return openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: "Hello" }],
      });
    });
    return result;
  });
}
```

### Class Decorators

```typescript
import { workflow, task } from "@anyway-sh/node-server-sdk";

class MyPipeline {
  @workflow({ name: "run" })
  async run() {
    return this.step();
  }

  @task({ name: "step" })
  async step() {
    // ...
  }
}
```

### Association Properties

Attach metadata to traces for filtering and grouping:

```typescript
await withWorkflow(
  {
    name: "chat",
    associationProperties: { userId: "user-123", sessionId: "abc" },
  },
  async () => {
    // All spans in this workflow will carry these properties
  },
);
```

## Configuration

Key options for `initialize()`:

| Option | Default | Description |
|--------|---------|-------------|
| `apiKey` | `ANYWAY_API_KEY` env var | API key for sending traces |
| `appName` | `npm_package_name` | Application name in traces |
| `baseUrl` | `ANYWAY_BASE_URL` or `https://api.traceloop.com` | Trace collector endpoint |
| `disableBatch` | `false` | Send spans immediately (for local dev) |
| `exporter` | OTLP exporter | Custom OpenTelemetry `SpanExporter` |
| `processor` | `BatchSpanProcessor` | Custom OpenTelemetry `SpanProcessor` |
| `instrumentModules` | — | Explicit module references for ESM projects |
| `pricingEnabled` | `true` | Calculate and attach cost attributes to spans |
| `pricingJsonPath` | — | Path to custom pricing JSON file |
| `tracingEnabled` | `true` | Enable/disable tracing entirely |
| `silenceInitializationMessage` | `false` | Suppress startup console message |

## Supported Providers

LLM providers and vector databases instrumented automatically:

- **OpenAI** — chat completions, embeddings
- **Anthropic** — messages
- **AWS Bedrock** — invoke model
- **Google Vertex AI** — generative models
- **Cohere** — chat, embed, rerank
- **Together AI** — chat completions
- **LangChain** — chains, agents, tools
- **LlamaIndex** — query engines, retrievers
- **Pinecone** — vector operations
- **ChromaDB** — collections, queries
- **Qdrant** — points, search
- **MCP** — Model Context Protocol client calls

## Pricing

Cost calculation is enabled by default. The SDK matches model names from spans against bundled pricing data and sets these attributes:

- `gen_ai.usage.input_cost`
- `gen_ai.usage.output_cost`
- `gen_ai.usage.cost`

To use custom pricing data:

```typescript
initialize({
  pricingJsonPath: "./my-pricing.json",
});
```

To disable:

```typescript
initialize({
  pricingEnabled: false,
});
```

## License

Apache-2.0
