import { calculateProposalDeviationScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2123
  test("提案内容と標準プロセスの乖離度算出 - 顧客対応記録の記録日時が null のとき、エラーが発生する", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const customerInteractionRecord = {
      customerId: "CUST-001",
      dealContent: "新規営業ソリューション提案",
      proposalContent: "クラウド型CRMシステムの導入",
      recordedAt: null,
    };

    expect(() =>
      calculateProposalDeviationScore(
        customerInteractionRecord,
        mockAIEngine
      )
    ).toThrow(/記録日時/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});