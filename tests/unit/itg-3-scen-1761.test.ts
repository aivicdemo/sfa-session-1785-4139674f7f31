import { it, describe, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  it("SCEN-1761: 根拠抽出期間が月をまたぐとき根拠を正しく分類する", async () => {
    const {
      extractAndClassifyRecommendationReasons,
    } = await import("../../src/logic/it-1-br-3-1-1-1");

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: "rec_2024_01_25_to_02_05",
        recommendations: [
          {
            patternId: "pat_001",
            industry: "IT",
            category: "approachType",
            successScore: 85,
            occurredAt: "2024-01-25T10:30:00Z",
          },
          {
            patternId: "pat_002",
            industry: "IT",
            category: "productType",
            successScore: 78,
            occurredAt: "2024-01-28T14:15:00Z",
          },
          {
            patternId: "pat_003",
            industry: "Manufacturing",
            category: "needsMatch",
            successScore: 92,
            occurredAt: "2024-01-31T09:00:00Z",
          },
          {
            patternId: "pat_004",
            industry: "IT",
            category: "approachType",
            successScore: 88,
            occurredAt: "2024-02-01T11:20:00Z",
          },
          {
            patternId: "pat_005",
            industry: "Finance",
            category: "productType",
            successScore: 81,
            occurredAt: "2024-02-02T15:45:00Z",
          },
          {
            patternId: "pat_006",
            industry: "Manufacturing",
            category: "needsMatch",
            successScore: 89,
            occurredAt: "2024-02-03T13:30:00Z",
          },
          {
            patternId: "pat_007",
            industry: "IT",
            category: "approachType",
            successScore: 86,
            occurredAt: "2024-02-05T10:00:00Z",
          },
        ],
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        reasoningExplanations: [
          {
            patternId: "pat_001",
            explanation: "IT業界での提案アプローチが過去85%の成功率を記録",
            month: "2024-01",
          },
          {
            patternId: "pat_002",
            explanation: "同業種の商材提案パターンが78%の採用率",
            month: "2024-01",
          },
          {
            patternId: "pat_003",
            explanation: "製造業の顧客ニーズマッチで92%の高い適合度",
            month: "2024-01",
          },
          {
            patternId: "pat_004",
            explanation: "2月のIT業界提案アプローチ成功パターン88%",
            month: "2024-02",
          },
          {
            patternId: "pat_005",
            explanation: "金融業界の商材提案で81%の成功実績",
            month: "2024-02",
          },
          {
            patternId: "pat_006",
            explanation: "2月の製造業顧客ニーズマッチ89%の適合度",
            month: "2024-02",
          },
          {
            patternId: "pat_007",
            explanation: "2月5日のIT業界提案アプローチ86%の成功確度",
            month: "2024-02",
          },
        ],
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScores: {
          pat_001: 0.85,
          pat_002: 0.78,
          pat_003: 0.92,
          pat_004: 0.88,
          pat_005: 0.81,
          pat_006: 0.89,
          pat_007: 0.86,
        },
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue({
        similarPatterns: [
          {
            patternId: "pat_001",
            occurredAt: "2024-01-25T10:30:00Z",
            industry: "IT",
          },
          {
            patternId: "pat_002",
            occurredAt: "2024-01-28T14:15:00Z",
            industry: "IT",
          },
          {
            patternId: "pat_003",
            occurredAt: "2024-01-31T09:00:00Z",
            industry: "Manufacturing",
          },
          {
            patternId: "pat_004",
            occurredAt: "2024-02-01T11:20:00Z",
            industry: "IT",
          },
          {
            patternId: "pat_005",
            occurredAt: "2024-02-02T15:45:00Z",
            industry: "Finance",
          },
          {
            patternId: "pat_006",
            occurredAt: "2024-02-03T13:30:00Z",
            industry: "Manufacturing",
          },
          {
            patternId: "pat_007",
            occurredAt: "2024-02-05T10:00:00Z",
            industry: "IT",
          },
        ],
      }),
    };

    const extractionPeriod = {
      startDate: new Date("2024-01-25T00:00:00Z"),
      endDate: new Date("2024-02-05T23:59:59Z"),
    };

    const newCaseCondition = {
      customerIndustry: "IT",
      budgetRange: "1000000-5000000",
      expectedDealSize: 2500000,
      requestedDeliveryMonth: "2024-03",
    };

    const result = await extractAndClassifyRecommendationReasons(
      extractionPeriod,
      newCaseCondition,
      mockAIRecommendationEngine
    );

    expect(result).toBeDefined();
    expect(result.classifiedReasons).toBeDefined();
    expect(Array.isArray(result.classifiedReasons)).toBe(true);
    expect(result.classifiedReasons.length).toBe(2);

    const januaryGroup = result.classifiedReasons.find(
      (group: { month: string }) => group.month === "2024-01"
    );
    expect(januaryGroup).toBeDefined();
    expect(januaryGroup.month).toBe("2024-01");
    expect(januaryGroup.items.length).toBe(3);
    expect(januaryGroup.items[0].patternId).toBe("pat_001");
    expect(januaryGroup.items[0].successScore).toBe(85);
    expect(januaryGroup.items[1].patternId).toBe("pat_002");
    expect(januaryGroup.items[1].successScore).toBe(78);
    expect(januaryGroup.items[2].patternId).toBe("pat_003");
    expect(januaryGroup.items[2].successScore).toBe(92);

    const februaryGroup = result.classifiedReasons.find(
      (group: { month: string }) => group.month === "2024-02"
    );
    expect(februaryGroup).toBeDefined();
    expect(februaryGroup.month).toBe("2024-02");
    expect(februaryGroup.items.length).toBe(4);
    expect(februaryGroup.items[0].patternId).toBe("pat_004");
    expect(februaryGroup.items[0].successScore).toBe(88);
    expect(februaryGroup.items[1].patternId).toBe("pat_005");
    expect(februaryGroup.items[1].successScore).toBe(81);
    expect(februaryGroup.items[2].patternId).toBe("pat_006");
    expect(februaryGroup.items[2].successScore).toBe(89);
    expect(februaryGroup.items[3].patternId).toBe("pat_007");
    expect(februaryGroup.items[3].successScore).toBe(86);

    expect(januaryGroup.categories).toBeDefined();
    expect(
      januaryGroup.categories.approachType.length +
        januaryGroup.categories.productType.length +
        januaryGroup.categories.needsMatch.length
    ).toBe(3);

    const januaryApproachTypePatterns =
      januaryGroup.categories.approachType.map(
        (item: { patternId: string }) => item.patternId
      );
    expect(januaryApproachTypePatterns).toContain("pat_001");
    expect(januaryApproachTypePatterns.length).toBe(1);

    const januaryProductTypePatterns =
      januaryGroup.categories.productType.map(
        (item: { patternId: string }) => item.patternId
      );
    expect(januaryProductTypePatterns).toContain("pat_002");
    expect(januaryProductTypePatterns.length).toBe(1);

    const januaryNeedsMatchPatterns =
      januaryGroup.categories.needsMatch.map(
        (item: { patternId: string }) => item.patternId
      );
    expect(januaryNeedsMatchPatterns).toContain("pat_003");
    expect(januaryNeedsMatchPatterns.length).toBe(1);

    expect(februaryGroup.categories).toBeDefined();
    expect(
      februaryGroup.categories.approachType.length +
        februaryGroup.categories.productType.length +
        februaryGroup.categories.needsMatch.length
    ).toBe(4);

    const februaryApproachTypePatterns =
      februaryGroup.categories.approachType.map(
        (item: { patternId: string }) => item.patternId
      );
    expect(februaryApproachTypePatterns).toContain("pat_004");
    expect(februaryApproachTypePatterns).toContain("pat_007");
    expect(februaryApproachTypePatterns.length).toBe(2);

    const februaryProductTypePatterns =
      februaryGroup.categories.productType.map(
        (item: { patternId: string }) => item.patternId
      );
    expect(februaryProductTypePatterns).toContain("pat_005");
    expect(februaryProductTypePatterns.length).toBe(1);

    const februaryNeedsMatchPatterns =
      februaryGroup.categories.needsMatch.map(
        (item: { patternId: string }) => item.patternId
      );
    expect(februaryNeedsMatchPatterns).toContain("pat_006");
    expect(februaryNeedsMatchPatterns.length).toBe(1);

    const allPatternIds = new Set<string>();
    result.classifiedReasons.forEach((monthGroup: { items: Array<{ patternId: string }> }) => {
      monthGroup.items.forEach((item: { patternId: string }) => {
        expect(allPatternIds.has(item.patternId)).toBe(false);
        allPatternIds.add(item.patternId);
      });
    });
    expect(allPatternIds.size).toBe(7);

    const expectedPatternIds = [
      "pat_001",
      "pat_002",
      "pat_003",
      "pat_004",
      "pat_005",
      "pat_006",
      "pat_007",
    ];
    expectedPatternIds.forEach((patternId: string) => {
      expect(allPatternIds.has(patternId)).toBe(true);
    });
  });
});