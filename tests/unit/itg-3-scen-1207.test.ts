import { evaluateProposalValidity } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1207: [error] 提案妥当性確認判定機能 - 営業プロセス条件が null のとき、エラーを返す", () => {
    // Arrange: AIRecommendationEngine のスタブを作成
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Act: 営業プロセス条件を null で提案妥当性確認判定機能を実行
    const result = evaluateProposalValidity(
      null,
      aiRecommendationEngineStub
    );

    // Assert: エラーオブジェクトの検証
    expect(result).toEqual({
      isValid: false,
      errorCode: "INVALID_SALES_PROCESS_CONDITION",
      errorMessage: "営業プロセス条件が null です",
    });

    // Assert: AIRecommendationEngine のメソッドが呼び出されていないことを検証
    expect(aiRecommendationEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(aiRecommendationEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});