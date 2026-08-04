import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能", () => {
  // SCEN-2715
  test("成功パターン抽出・照合機能 - 過去商談データから0件の成功パターンが存在する場合、推奨内容が生成される", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockRejectedValue(new Error("API_TIMEOUT")),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newBusinessCondition = {
      customerIndustry: "IT",
      budgetScale: "large",
      dealStage: "initial_contact",
      customerSize: "enterprise",
      dealAmount: 5000000,
    };

    const recommendedPatternsFromMaster = [
      {
        patternId: "pattern_001",
        name: "大規模企業向けITソリューション提案",
        successRate: 0.78,
        description: "規模の大きい企業へのIT導入支援アプローチ",
        applicableIndustries: ["IT", "Finance", "Manufacturing"],
        recommendedActions: [
          "経営層へのビジネス価値説明",
          "POC実施提案",
          "3ヶ月導入スケジュール提示",
        ],
      },
      {
        patternId: "pattern_002",
        name: "予算枠大型案件の段階的提案",
        successRate: 0.72,
        description: "大規模予算を持つ顧客への段階的アプローチ",
        applicableIndustries: ["IT", "Consulting", "Manufacturing"],
        recommendedActions: [
          "初期段階での小規模パイロット提案",
          "ROI試算表提供",
          "段階的拡大計画提示",
        ],
      },
    ];

    const result = generateRecommendation(
      newBusinessCondition,
      mockAIRecommendationEngine,
      recommendedPatternsFromMaster
    );

    expect(result).toBeDefined();
    expect(result.recommendedApproaches).toHaveLength(2);
    expect(result.recommendedApproaches[0]).toEqual({
      patternId: "pattern_001",
      name: "大規模企業向けITソリューション提案",
      description: "規模の大きい企業へのIT導入支援アプローチ",
      successRate: 0.78,
      applicableIndustries: ["IT", "Finance", "Manufacturing"],
      recommendedActions: [
        "経営層へのビジネス価値説明",
        "POC実施提案",
        "3ヶ月導入スケジュール提示",
      ],
    });
    expect(result.recommendedApproaches[1]).toEqual({
      patternId: "pattern_002",
      name: "予算枠大型案件の段階的提案",
      description: "大規模予算を持つ顧客への段階的アプローチ",
      successRate: 0.72,
      applicableIndustries: ["IT", "Consulting", "Manufacturing"],
      recommendedActions: [
        "初期段階での小規模パイロット提案",
        "ROI試算表提供",
        "段階的拡大計画提示",
      ],
    });
    expect(result.reasoning).toBe("統計データに基づく推奨");
    expect(result.usedFallback).toBe(true);
    expect(result.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);
    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newBusinessCondition
    );
  });
});