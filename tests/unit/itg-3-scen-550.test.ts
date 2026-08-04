import { describe, test, expect, beforeEach } from "@jest/globals";
import { decideSalesGuidancePolicy } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能 - 営業指導方針決定", () => {
  let mockAIEngine: {
    generateRecommendation: jest.Mock;
    findSimilarPatterns: jest.Mock;
    explainRecommendationReasoning: jest.Mock;
    evaluatePatternRelevance: jest.Mock;
  };

  beforeEach(() => {
    mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };
  });

  // SCEN-550: [edge] 営業指導方針決定機能 - 改善対象項目が複数件のとき方針が複合指示になる
  test("should return COMPOSITE policy with multiple directives when 3 or more improvement items are flagged", () => {
    const improvementItems = [
      {
        itemId: "proposal_quality",
        name: "提案資料の充実度",
        isFlaggedForImprovement: true,
        currentScore: 65,
        targetScore: 85,
      },
      {
        itemId: "hearing_depth",
        name: "顧客ヒアリング深さ",
        isFlaggedForImprovement: true,
        currentScore: 55,
        targetScore: 80,
      },
      {
        itemId: "followup_frequency",
        name: "フォローアップ頻度",
        isFlaggedForImprovement: true,
        currentScore: 45,
        targetScore: 75,
      },
    ];

    const caseData = {
      caseId: "CASE-2024-001",
      salesPersonId: "SP-123",
      customerIndustry: "IT",
      dealAmount: 5000000,
      improvementItems: improvementItems,
      recordedAt: new Date("2024-06-15T10:00:00Z"),
    };

    const mockRecommendation = {
      policyType: "COMPOSITE",
      directives: [
        {
          itemId: "proposal_quality",
          actionDescription:
            "提案資料のたたき台をAI生成し、顧客課題に基づいた内容を準備。最終確認後に送付する。",
          priority: "HIGH",
          estimatedTimeMinutes: 30,
        },
        {
          itemId: "hearing_depth",
          actionDescription:
            "顧客業界動向を事前調査し、質問項目を3点以上準備して次回商談に臨む。",
          priority: "MEDIUM",
          estimatedTimeMinutes: 45,
        },
        {
          itemId: "followup_frequency",
          actionDescription:
            "商談後3日以内にパーソナライズされたフォローメールを自動送付する。",
          priority: "HIGH",
          estimatedTimeMinutes: 15,
        },
      ],
      overallGuidance:
        "3つの改善項目に対して段階的アプローチを推奨します。まず資料準備を優先し、その後ヒアリング準備、最後にフォローアップ自動化を実装してください。これにより営業効率と提案採用率が向上します。",
    };

    mockAIEngine.generateRecommendation.mockResolvedValue(mockRecommendation);

    const result = decideSalesGuidancePolicy(caseData, mockAIEngine);

    expect(result).toEqual({
      policyType: "COMPOSITE",
      directives: [
        {
          itemId: "proposal_quality",
          actionDescription:
            "提案資料のたたき台をAI生成し、顧客課題に基づいた内容を準備。最終確認後に送付する。",
          priority: "HIGH",
          estimatedTimeMinutes: 30,
        },
        {
          itemId: "hearing_depth",
          actionDescription:
            "顧客業界動向を事前調査し、質問項目を3点以上準備して次回商談に臨む。",
          priority: "MEDIUM",
          estimatedTimeMinutes: 45,
        },
        {
          itemId: "followup_frequency",
          actionDescription:
            "商談後3日以内にパーソナライズされたフォローメールを自動送付する。",
          priority: "HIGH",
          estimatedTimeMinutes: 15,
        },
      ],
      overallGuidance:
        "3つの改善項目に対して段階的アプローチを推奨します。まず資料準備を優先し、その後ヒアリング準備、最後にフォローアップ自動化を実装してください。これにより営業効率と提案採用率が向上します。",
    });

    expect(result.policyType).toBe("COMPOSITE");
    expect(result.directives).toHaveLength(3);

    result.directives.forEach((directive) => {
      expect(directive).toHaveProperty("itemId");
      expect(directive).toHaveProperty("actionDescription");
      expect(directive).toHaveProperty("priority");
      expect(directive).toHaveProperty("estimatedTimeMinutes");
      expect(["HIGH", "MEDIUM", "LOW"]).toContain(directive.priority);
      expect(typeof directive.estimatedTimeMinutes).toBe("number");
      expect(directive.estimatedTimeMinutes).toBeGreaterThan(0);
    });

    expect(result.overallGuidance).toBeDefined();
    expect(result.overallGuidance.length).toBeGreaterThanOrEqual(100);
    expect(result.overallGuidance).toMatch(/段階的アプローチ/);
  });
});