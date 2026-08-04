import { evaluateTransactionDataQuality } from "../../src/logic/itg-3";

describe("AIエージェント推奨支援システム - 営業トランザクションデータ品質評価", () => {
  // SCEN-441
  test("営業トランザクションのエラー件数が0件の場合、該当カテゴリのスコアが満点で算出される", () => {
    // Arrange: モック化されたAIRecommendationEngine
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // Arrange: モック化されたFileStorageAdapter
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // Arrange: エラー0件のトランザクションデータセット
    const transactionDataset = [
      {
        id: "txn_001",
        category: "proposal_followup",
        dealId: "deal_001",
        customerId: "cust_001",
        proposalContent: "Initial proposal for cloud migration",
        followupDate: "2024-01-15T10:00:00Z",
        errorCount: 0,
        status: "completed",
      },
      {
        id: "txn_002",
        category: "proposal_followup",
        dealId: "deal_002",
        customerId: "cust_002",
        proposalContent: "Cost optimization proposal",
        followupDate: "2024-01-16T11:30:00Z",
        errorCount: 0,
        status: "completed",
      },
      {
        id: "txn_003",
        category: "proposal_followup",
        dealId: "deal_003",
        customerId: "cust_003",
        proposalContent: "Security enhancement proposal",
        followupDate: "2024-01-17T09:15:00Z",
        errorCount: 0,
        status: "completed",
      },
      {
        id: "txn_004",
        category: "proposal_followup",
        dealId: "deal_004",
        customerId: "cust_004",
        proposalContent: "Digital transformation roadmap",
        followupDate: "2024-01-18T14:45:00Z",
        errorCount: 0,
        status: "completed",
      },
      {
        id: "txn_005",
        category: "proposal_followup",
        dealId: "deal_005",
        customerId: "cust_005",
        proposalContent: "AI implementation strategy",
        followupDate: "2024-01-19T13:20:00Z",
        errorCount: 0,
        status: "completed",
      },
    ];

    // Act: 品質評価機能を実行
    const evaluationResult = evaluateTransactionDataQuality(
      transactionDataset,
      "proposal_followup",
      mockAIEngine,
      mockFileStorage
    );

    // Assert: 該当カテゴリのスコアが満点で算出されることを確認
    expect(evaluationResult.categoryScore).toBe(100);
    expect(typeof evaluationResult.categoryScore).toBe("number");
    expect(evaluationResult.transactionCount).toBe(5);
    expect(evaluationResult.errorCount).toBe(0);
    expect(evaluationResult.evaluationStatus).toBe("completed");
  });
});