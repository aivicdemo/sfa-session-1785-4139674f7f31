import { analyzeContactGapScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2202
  test("顧客対応の接触回数が成功パターンより 1 回少ないとき、不足接触による乖離スコアが算出される", () => {
    const mockAIRecommendationEngine = {
      getSuccessPatternContactCount: jest.fn().mockReturnValue(5),
    };

    const contactPattern = {
      currentContactCount: 4,
      contactPhases: [
        { phase: "初回提案", timestamp: new Date("2024-01-10T09:00:00Z") },
        {
          phase: "フォローメール送付",
          timestamp: new Date("2024-01-12T14:00:00Z"),
        },
        { phase: "2回目提案", timestamp: new Date("2024-01-15T10:00:00Z") },
        { phase: "最終確認", timestamp: new Date("2024-01-18T15:00:00Z") },
      ],
      customerId: "CUST_001",
      dealId: "DEAL_001",
    };

    const result = analyzeContactGapScore(contactPattern, mockAIRecommendationEngine);

    expect(result.contactGapScore).toBe(20.0);
    expect(result.insufficientContactCount).toBe(1);
    expect(result.missingPhase).toBe("商談後クロージング支援フェーズ");
    expect(result.standardContactCount).toBe(5);
    expect(result.actualContactCount).toBe(4);
    expect(mockAIRecommendationEngine.getSuccessPatternContactCount).toHaveBeenCalledWith({
      customerId: "CUST_001",
      dealId: "DEAL_001",
    });
  });
});