import { PricingData } from "./calculator";
import defaultPricing from "./data/default_pricing.json";

export function loadPricing(pricingJsonPath?: string): PricingData {
  if (pricingJsonPath) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs");
    return JSON.parse(fs.readFileSync(pricingJsonPath, "utf-8"));
  }
  return defaultPricing as PricingData;
}
