import { describe, test, expect, beforeEach } from "@jest/globals";
import { calculateImprovementTargets } from "../../src/logic/itg-3";

interface AIRecommendationEngineStub {
  generateRecommendation: jest.Mock;
}

interface InconsistencyLog {
  id: string;
  message: string;
  severity: string;
}

describe("AIエージェント推奨支援システム - 改善対象項目の算出機能", () => {
  let aiEngineStub: AIRecommendationEngineStub;

  beforeEach(() => {
    aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: "standard_approach",
        confidenceScore: 85,
        rationale: "Based on similar patterns",
      }),
    };
  });

  // SCEN-495
  test("should throw error when inconsistencyLog is null", () => {
    const nullInconsistencyLog: InconsistencyLog | null = null;
    const targetDate = new Date("2024-01-15T11:00:00Z");

    expect(() =>
      calculateImprovementTargets(
        nullInconsistencyLog,
        aiEngineStub,
        targetDate
      )
    ).toThrow(/データ不整合ログ/);
  });
});