import { generateRecommendation } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-030: 学習データが0件の場合に推論実行が保留される", () => {
    // Arrange: 学習データ0件の状態をシミュレート
    const learningDataCount = 0;
    const newCaseData = {
      customerId: "CUST-001",
      customerIndustry: "IT",
      customerScale: "large",
      dealAmount: 5000000,
      dealStage: "proposal",
    };

    // AIRecommendationEngineのスタブを設定
    // 外部呼び出しが実行されないことを保証するため、
    // 呼ばれた場合は例外を発生させる
    const aiEngineStub = {
      generateRecommendation: jest.fn(() => {
        throw new Error("AIEngine should not be called when learning data is 0");
      }),
      findSimilarPatterns: jest.fn(() => {
        throw new Error(
          "AIEngine should not be called when learning data is 0"
        );
      }),
      explainRecommendationReasoning: jest.fn(() => {
        throw new Error(
          "AIEngine should not be called when learning data is 0"
        );
      }),
      evaluatePatternRelevance: jest.fn(() => {
        throw new Error(
          "AIEngine should not be called when learning data is 0"
        );
      }),
    };

    // Act: 推論実行API呼び出し
    const result = generateRecommendation(newCaseData, learningDataCount, aiEngineStub);

    // Assert: 推論実行がPENDING状態で返却される
    expect(result.status).toBe("PENDING");
    expect(result.recommendation).toBeNull();
    expect(result.userMessage).toBe(
      "学習データが不足しています。十分なデータが蓄積されるまで推奨の生成は利用できません"
    );

    // AIエンジンの外部呼び出しが実行されていないことを確認
    expect(aiEngineStub.generateRecommendation).not.toHaveBeenCalled();
    expect(aiEngineStub.findSimilarPatterns).not.toHaveBeenCalled();
    expect(aiEngineStub.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(aiEngineStub.evaluatePatternRelevance).not.toHaveBeenCalled();

    // システムログの検証
    expect(result.systemLog).toContain("Learning data count: 0");
    expect(result.systemLog).toContain(
      "recommendation execution status: PENDING"
    );
  });
});