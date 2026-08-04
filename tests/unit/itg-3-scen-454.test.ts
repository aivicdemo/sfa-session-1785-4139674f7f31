import { aggregateImprovementItemsBySalesPerson } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 営業担当者別改善対象抽出", () => {
  // SCEN-454
  test("複数の改善対象項目が同一営業担当者に属する場合、担当者ごとに項目が集約される", () => {
    const improvementItems = [
      {
        itemId: "item_001",
        salesPersonId: "S001",
        salesPersonName: "営業担当者A",
        improvementTarget: "提案資料作成スキル",
        category: "skill",
      },
      {
        itemId: "item_002",
        salesPersonId: "S001",
        salesPersonName: "営業担当者A",
        improvementTarget: "顧客ヒアリング記録",
        category: "process",
      },
      {
        itemId: "item_003",
        salesPersonId: "S001",
        salesPersonName: "営業担当者A",
        improvementTarget: "フォローアップメール送付",
        category: "communication",
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn((item) => ({
        itemId: item.itemId,
        recommendedAction: `改善提案: ${item.improvementTarget}`,
        confidenceScore: 85,
      })),
    };

    const result = aggregateImprovementItemsBySalesPerson(
      improvementItems,
      mockAIEngine
    );

    expect(result).toHaveLength(1);
    expect(result[0].salesPersonId).toBe("S001");
    expect(result[0].salesPersonName).toBe("営業担当者A");
    expect(result[0].aggregatedItemCount).toBe(3);
    expect(result[0].itemIds).toEqual(["item_001", "item_002", "item_003"]);
    expect(result[0].itemIds).toContain("item_001");
    expect(result[0].itemIds).toContain("item_002");
    expect(result[0].itemIds).toContain("item_003");
  });
});