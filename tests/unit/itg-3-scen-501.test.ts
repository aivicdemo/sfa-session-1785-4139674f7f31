import { describe, test, expect, beforeEach } from "@jest/globals";
import { decideCoachingPolicyForSalesPerson } from "../../src/logic/itg-3";

interface MockAIRecommendationEngine {
  findSimilarPatterns: jest.Mock;
}

interface SalesPersonCoachingInput {
  customerName: string;
  dealAmount: number;
  industry: string;
  salesPersonId: string;
}

interface SimilarPatternResult {
  patternId: string;
  improvementPriorityRank: string | null;
  successRate: number;
  matchScore: number;
}

describe("AIエージェント推奨支援システム - 営業担当者への指導方針決定", () => {
  // SCEN-501: [error] 営業担当者への指導方針の決定機能 - 改善優先度ランク情報が null のとき、エラーが発生する
  test("should throw error with code MISSING_PRIORITY_RANK when improvementPriorityRank is null", () => {
    const mockAIEngine: MockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn(),
    };

    const similarPatternResult: SimilarPatternResult = {
      patternId: "pattern-001",
      improvementPriorityRank: null,
      successRate: 0.85,
      matchScore: 0.92,
    };

    mockAIEngine.findSimilarPatterns.mockReturnValue([
      similarPatternResult,
    ]);

    const salesPersonInput: SalesPersonCoachingInput = {
      customerName: "株式会社テスト商社",
      dealAmount: 5000000,
      industry: "製造業",
      salesPersonId: "SP-12345",
    };

    expect(() => {
      decideCoachingPolicyForSalesPerson(salesPersonInput, mockAIEngine);
    }).toThrow(/改善優先度ランク/);
  });
});