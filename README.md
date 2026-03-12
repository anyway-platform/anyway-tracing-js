<h1 align="center">Anyway Tracing JS</h1>
<p align="center">
  <p align="center">Open-source observability for your LLM application</p>
</p>
<h4 align="center">
   <a href="https://github.com/anyway-platform/anyway-tracing-js/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-Apache 2.0-blue.svg" alt="Anyway Tracing JS is released under the Apache-2.0 License">
  </a>
  <a href="https://github.com/anyway-platform/anyway-tracing-js/actions/workflows/ci.yml">
  <img src="https://github.com/anyway-platform/anyway-tracing-js/actions/workflows/ci.yml/badge.svg">
  </a>
  <a href="https://github.com/anyway-platform/anyway-tracing-js/blob/main/CONTRIBUTING.md">
    <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen" alt="PRs welcome!" />
  </a>
  <a href="https://github.com/anyway-platform/anyway-tracing-js/issues">
    <img src="https://img.shields.io/github/commit-activity/m/anyway-platform/anyway-tracing-js" alt="git commit activity" />
  </a>
</h4>

Anyway Tracing JS is a set of extensions built on top of [OpenTelemetry](https://opentelemetry.io/) that gives you complete observability over your LLM application. Because it uses OpenTelemetry under the hood, it can be connected to your existing observability solutions - Datadog, Honeycomb, and others.

It's forked from [Traceloop's OpenLLMetry-JS](https://github.com/traceloop/openllmetry-js) and maintained under the Apache 2.0 license.

The repo contains standard OpenTelemetry instrumentations for LLM providers and Vector DBs, as well as an Anyway SDK that makes it easy to get started, while still outputting standard OpenTelemetry data that can be connected to your observability stack.
If you already have OpenTelemetry instrumented, you can just add any of our instrumentations directly.

## Getting Started

The easiest way to get started is to use our SDK.

Install the SDK:

```shell
npm install --save @anyway-sh/node-server-sdk
```

Then, to start instrumenting your code, just add these 2 lines to your code:

```js
import * as traceloop from "@anyway-sh/node-server-sdk";

traceloop.initialize();
```

Make sure to `import` the SDK before importing any LLM module.

That's it. You're now tracing your code with Anyway Tracing JS!
If you're running this locally, you may want to disable batch sending, so you can see the traces immediately:

```js
traceloop.initialize({ disableBatch: true });
```

Now, you need to decide where to export the traces to.

## Supported (and tested) destinations

- Datadog
- New Relic
- Honeycomb
- Grafana Tempo
- HyperDX
- SigNoz
- Splunk
- OpenTelemetry Collector

## What do we instrument?

Anyway Tracing JS can instrument everything that [OpenTelemetry already instruments](https://github.com/open-telemetry/opentelemetry-js-contrib/tree/main/plugins/node) - so things like your DB, API calls, and more. On top of that, we built a set of custom extensions that instrument things like your calls to OpenAI or Anthropic, or your Vector DB like Pinecone, Chroma, or Weaviate.

### LLM Providers

- OpenAI
- Azure OpenAI
- Anthropic
- Cohere
- Vertex AI (GCP)
- Bedrock (AWS)

### Vector DBs

- Pinecone
- Chroma
- Qdrant

### Frameworks

- LangChain
- LlamaIndex

## Attribution

This project is forked from [Traceloop's OpenLLMetry-JS](https://github.com/traceloop/openllmetry-js) and is licensed under Apache 2.0.
