import { describe, test, expect, beforeEach, afterEach } from "@jest/globals";
import type {
  DealCondition,
  CurrentDealData,
  AIRecommendationEngine,
  RecommendationResult,
  IntegratedCondition,
} from "../../src/logic/it-1-br-3-3-2-1";
import { generateRecommendationWithConditionIntegration } from "../../src/logic/it-1-br-3-3-2-1";

describe("AIエージェント推奨支援システム - 商談条件統合と成功パターン照合", () => {
  let capturedIntegratedCondition: IntegratedCondition | null = null;
  let mockAIEngine: AIRecommendationEngine;

  beforeEach(() => {
    capturedIntegratedCondition = null;

    mockAIEngine = {
      generateRecommendation: jest.fn(
        (condition: IntegratedCondition): RecommendationResult => {
          capturedIntegratedCondition = condition;
          return {
            recommendedApproach: "コスト削減提案を優先実施",
            successPatternId: "pattern-001",
            confidenceScore: 85,
            reasoningDetails: "製造業での即座導入は成功率が高い",
          };
        }
      ),
      findSimilarPatterns: jest.fn(() => []),
      explainRecommendationReasoning: jest.fn(() => ""),
      evaluatePatternRelevance: jest.fn(() => 0),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-937
  test("商談条件マスタから現在の案件に合致する複数条件がすべて統合され、AIエンジンに渡される", () => {
    const dealConditionsFromMaster: DealCondition[] = [
      {
        conditionId: "cond-a",
        industry: "製造業",
        budgetRange: "1000万円以上",
        decisionMakers: "3名以上",
      },
      {
        conditionId: "cond-b",
        industry: "製造業",
        projectPeriod: "Q1-Q2",
        proposalType: "コスト削減",
      },
      {
        conditionId: "cond-c",
        budgetRange: "1000万円以上",
        implementationTiming: "即座",
      },
    ];

    const currentDeal: CurrentDealData = {
      dealId: "deal-001",
      industry: "製造業",
      budgetRange: "1500万円",
      decisionMakers: 4,
      projectPeriod: "Q1",
      proposalType: "コスト削減",
      implementationTiming: "即座",
    };

    const result = generateRecommendationWithConditionIntegration(
      currentDeal,
      dealConditionsFromMaster,
      mockAIEngine
    );

    expect(capturedIntegratedCondition).toEqual({
      industry: "製造業",
      budgetRange: "1000万円以上",
      decisionMakers: "3名以上",
      projectPeriod: "Q1-Q2",
      proposalType: "コスト削減",
      implementationTiming: "即座",
    });

    expect(result).toEqual({
      recommendedApproach: "コスト削減提案を優先実施",
      successPatternId: "pattern-001",
      confidenceScore: 85,
      reasoningDetails: "製造業での即座導入は成功率が高い",
    });

    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(1);
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      capturedIntegratedCondition
    );
  });
});