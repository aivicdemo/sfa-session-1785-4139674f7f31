import { validateProposalAndEvaluateSuitability } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  test("SCEN-1281: 却下済み提案に対する妥当性判定はエラーを返す", () => {
    // 却下済み状態の提案オブジェクト
    const rejectedProposal = {
      id: "PROP-12345",
      status: "REJECTED",
      customerId: "CUST-001",
      proposalContent: "提案内容サンプル",
      customerConstraints: {
        budgetLimit: 10000000,
        implementationDeadline: "2025-12-31",
        allowedProductCategories: ["カテゴリA", "カテゴリB"],
      },
    };

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 期待値: 'PROPOSAL_ALREADY_REJECTED'エラーコードを含む例外がスローされる
    expect(() =>
      validateProposalAndEvaluateSuitability(rejectedProposal, mockAIEngine)
    ).toThrow(/PROPOSAL_ALREADY_REJECTED/);

    // AIRecommendationEngineのgenerateRecommendationは呼び出されないことを検証
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});