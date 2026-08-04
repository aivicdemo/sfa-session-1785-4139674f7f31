import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2083
  test("[normal] 提案内容と顧客対応パターンの標準プロセス照合分析 - 成功パターン合致スコアが 74 のとき、中程度の合致と判定される", () => {
    // Arrange
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(74),
    };

    const proposalContent = {
      approach: "顧客の経営課題に対する包括的なソリューション提案",
      timing: "初回商談から2週間以内",
      followUpActions: ["ヒアリング資料の送付", "経営層向けプレゼン実施"],
    };

    const customerInteractionPattern = {
      responseRate: "48時間以内",
      communicationChannel: "メール+電話併用",
      decisionMakerEngagement: "部長級への早期接触",
    };

    // Act
    const matchLevel = evaluatePatternRelevance(
      proposalContent,
      customerInteractionPattern,
      mockAIRecommendationEngine
    );

    // Assert
    expect(matchLevel).toBe("Medium Match");
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).toHaveBeenCalledWith(
      proposalContent,
      customerInteractionPattern
    );
  });
});