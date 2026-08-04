import { evaluatePurchaseHistoryDataQuality } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1464
  test("購買履歴データが空配列のとき品質スコアと不適合項目を返す", () => {
    const purchase_history = [];

    const result = evaluatePurchaseHistoryDataQuality(purchase_history);

    expect(result).toHaveProperty("qualityScore");
    expect(result).toHaveProperty("nonConformingItems");

    expect(typeof result.qualityScore).toBe("number");
    expect(result.qualityScore).toBeGreaterThanOrEqual(0);
    expect(result.qualityScore).toBeLessThanOrEqual(100);

    expect(Array.isArray(result.nonConformingItems)).toBe(true);
    expect(result.nonConformingItems.length).toBeGreaterThan(0);

    expect(result.qualityScore).toBe(0);
    expect(result.nonConformingItems).toContainEqual(
      expect.stringMatching(/購買履歴/)
    );
  });
});