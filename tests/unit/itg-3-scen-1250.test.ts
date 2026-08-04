import { evaluateProposalFeasibility } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  test("SCEN-1250: 顧客ニーズが0件のときに提案妥当性判定が適切に処理される", () => {
    // Arrange: 顧客ニーズデータベースをモック化（空配列を返す）
    const mockCustomerNeedsDb = {
      findByCustomerId: jest.fn().mockReturnValue([]),
    };

    // AIRecommendationEngineをスタブ化
    const mockAiEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // テスト入力データ
    const proposalInput = {
      customerId: "TEST-CUST-001",
      dealId: "TEST-DEAL-001",
      proposalContent: "標準パッケージA",
      customerNeedsDb: mockCustomerNeedsDb,
      aiEngine: mockAiEngine,
    };

    // Act: 提案妥当性判定関数を実行
    const result = evaluateProposalFeasibility(proposalInput);

    // Assert: 戻り値を検証
    expect(result.statusCode).toBe(200);
    expect(result.judgmentResult).toMatch(
      /INDETERMINATE|UNABLE_TO_EVALUATE/
    );
    expect(result.reason).toContain(
      "顧客ニーズ情報が登録されていないため、提案の妥当性を評価できません"
    );
    expect(result.fallbackProposal).toBeUndefined();
    expect(result.error).toBeUndefined();

    // 内部処理として顧客ニーズ参照が実行されたことを確認
    expect(mockCustomerNeedsDb.findByCustomerId).toHaveBeenCalledWith(
      "TEST-CUST-001"
    );
  });
});