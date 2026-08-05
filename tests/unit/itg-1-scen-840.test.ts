import { describe, test, expect } from "@jest/globals";
import { reviewDetectionResult } from "../../src/logic/it-1-br-2-1-1-1";

describe("AIエージェント推論精度の自動監視とアラート機能", () => {
  // SCEN-840
  test("should throw error when AI-generated detection result does not exist", () => {
    const detectionResult = null;

    expect(() => {
      reviewDetectionResult(detectionResult);
    }).toThrow(/検出結果/);
  });
});