import { validateProposalSuitability } from "../../src/logic/it-1-br-3-1-1-1";

describe("提案妥当性確認判定機能", () => {
  test("SCEN-1231: 顧客ニーズの有効期限が切れているとき、警告とともにエラーを返す", () => {
    const currentTimestamp = new Date("2025-02-01T10:00:00Z");
    const expiredDate = new Date("2025-01-01T23:59:59Z");

    const customerNeedInput = {
      customerNeedId: "need-001",
      customerId: "cust-001",
      needTitle: "システム統合の効率化",
      needDescription: "既存システムと新規システムの統合が必要",
      validFrom: new Date("2024-12-01T00:00:00Z"),
      validUntil: expiredDate,
      priority: "high",
      businessImpact: "営業効率向上",
    };

    const proposalInput = {
      proposalId: "prop-001",
      customerId: "cust-001",
      proposalContent: "統合プラットフォーム導入提案",
      estimatedBudget: 5000000,
      proposedTimeline: "3ヶ月",
      expectedROI: 2.5,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = validateProposalSuitability(
      customerNeedInput,
      proposalInput,
      currentTimestamp,
      mockAIEngine
    );

    expect(result.status).toBe("error");
    expect(result.errorCode).toBe("CUSTOMER_NEED_EXPIRED");
    expect(result.warningMessage).toBe(
      "顧客ニーズの有効期限が切れています。最新の情報を確認してください"
    );
    expect(result.proposalRecommendation).toBeNull();
    expect(result.processedAt).toEqual(currentTimestamp);
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
  });
});