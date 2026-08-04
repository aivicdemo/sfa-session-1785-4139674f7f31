import { generateGuidancePolicy } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 指導方針決定機能", () => {
  test("SCEN-433: 改善対象項目が複数件の場合、全項目が方針に正しく含まれる", () => {
    const mockRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        improvements: [
          { id: "IMP001", item: "提案資料の充実度向上", priority: 1 },
          { id: "IMP002", item: "顧客課題のヒアリング深掘り", priority: 2 },
          { id: "IMP003", item: "フォローアップ頻度の増加", priority: 3 }
        ],
        recommendationScore: 85,
        timestamp: new Date("2024-01-15T10:00:00Z")
      })
    };

    const dealConditions = {
      customerId: "CUST001",
      dealId: "DEAL001",
      industry: "製造業",
      dealSize: 5000000,
      dealStage: "提案段階"
    };

    const result = generateGuidancePolicy(dealConditions, mockRecommendationEngine);

    expect(result).toHaveProperty("improvements");
    expect(Array.isArray(result.improvements)).toBe(true);
    expect(result.improvements).toHaveLength(3);

    expect(result.improvements[0]).toEqual({
      id: "IMP001",
      item: "提案資料の充実度向上",
      priority: 1
    });

    expect(result.improvements[1]).toEqual({
      id: "IMP002",
      item: "顧客課題のヒアリング深掘り",
      priority: 2
    });

    expect(result.improvements[2]).toEqual({
      id: "IMP003",
      item: "フォローアップ頻度の増加",
      priority: 3
    });

    const itemNames = result.improvements.map((imp: { item: string }) => imp.item);
    expect(itemNames).toContain("提案資料の充実度向上");
    expect(itemNames).toContain("顧客課題のヒアリング深掘り");
    expect(itemNames).toContain("フォローアップ頻度の増加");

    const uniqueItems = new Set(itemNames);
    expect(uniqueItems.size).toBe(3);

    expect(mockRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      dealConditions
    );
  });
});