import { ReadableSpan } from "@opentelemetry/sdk-trace-base";
import {
  ATTR_GEN_AI_REQUEST_MODEL,
  ATTR_GEN_AI_RESPONSE_MODEL,
  ATTR_GEN_AI_USAGE_INPUT_TOKENS,
  ATTR_GEN_AI_USAGE_OUTPUT_TOKENS,
  ATTR_GEN_AI_USAGE_PROMPT_TOKENS,
  ATTR_GEN_AI_USAGE_COMPLETION_TOKENS,
} from "@opentelemetry/semantic-conventions/incubating";

interface NormalizedPricing {
  inputCostPerToken: number;
  outputCostPerToken: number;
}

interface ModelPricing {
  promptPrice: number;
  completionPrice: number;
}

export interface PricingData {
  chat?: Record<string, ModelPricing>;
  embeddings?: Record<string, number>;
  images?: Record<string, unknown>;
  audio?: Record<string, unknown>;
}

const DATE_SUFFIX_PATTERN = /-\d{4}-\d{2}-\d{2}$/;
const DATE_COMPACT_SUFFIX_PATTERN = /-\d{8}$/;

export class PricingCalculator {
  private chatModels: Record<string, ModelPricing>;

  constructor(pricingData: PricingData) {
    this.chatModels = pricingData.chat ?? {};
  }

  findPricing(modelName: string): NormalizedPricing | null {
    if (!modelName) return null;

    const models = this.chatModels;

    // 1. Exact match
    if (models[modelName]) {
      return this.normalize(models[modelName]);
    }

    // 2. Strip date suffix and retry
    let stripped = modelName.replace(DATE_SUFFIX_PATTERN, "");
    stripped = stripped.replace(DATE_COMPACT_SUFFIX_PATTERN, "");
    if (stripped !== modelName && models[stripped]) {
      return this.normalize(models[stripped]);
    }

    // 3. Prefix match (longest wins)
    let bestMatch: string | null = null;
    let bestLen = 0;
    for (const baseModel of Object.keys(models)) {
      if (modelName.startsWith(baseModel) && baseModel.length > bestLen) {
        bestMatch = baseModel;
        bestLen = baseModel.length;
      }
    }
    if (bestMatch) {
      return this.normalize(models[bestMatch]);
    }

    return null;
  }

  addCostAttributes(span: ReadableSpan): void {
    const attrs = span.attributes;
    if (!attrs) return;

    const model =
      (attrs[ATTR_GEN_AI_RESPONSE_MODEL] as string) ||
      (attrs[ATTR_GEN_AI_REQUEST_MODEL] as string);
    if (!model) return;

    const inputTokens = (attrs[ATTR_GEN_AI_USAGE_INPUT_TOKENS] ??
      attrs[ATTR_GEN_AI_USAGE_PROMPT_TOKENS]) as number | undefined;
    const outputTokens = (attrs[ATTR_GEN_AI_USAGE_OUTPUT_TOKENS] ??
      attrs[ATTR_GEN_AI_USAGE_COMPLETION_TOKENS]) as number | undefined;

    if (inputTokens == null && outputTokens == null) return;

    const pricing = this.findPricing(model);
    if (!pricing) return;

    const inputCost = (inputTokens ?? 0) * pricing.inputCostPerToken;
    const outputCost = (outputTokens ?? 0) * pricing.outputCostPerToken;

    span.attributes["gen_ai.usage.input_cost"] = inputCost;
    span.attributes["gen_ai.usage.output_cost"] = outputCost;
    span.attributes["gen_ai.usage.cost"] = inputCost + outputCost;
  }

  private normalize(pricing: ModelPricing): NormalizedPricing {
    return {
      inputCostPerToken: (pricing.promptPrice ?? 0) / 1000,
      outputCostPerToken: (pricing.completionPrice ?? 0) / 1000,
    };
  }
}
