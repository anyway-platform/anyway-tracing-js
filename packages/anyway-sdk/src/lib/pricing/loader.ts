import { PricingData } from "./calculator";

export function loadPricing(pricingJsonPath?: string): PricingData {
  if (pricingJsonPath) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require("fs");
    return JSON.parse(fs.readFileSync(pricingJsonPath, "utf-8"));
  }
  return require("./data/default_pricing.json");
}
