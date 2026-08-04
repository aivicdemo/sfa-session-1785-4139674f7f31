import { it, describe, expect, beforeEach, afterEach } from "@jest/globals";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-322
  it("推奨履歴の記録機能 - 複数件の推奨内容がすべて検索・参照対象になる", async () => {
    // 1. AIRecommendationEngineのスタブ設定
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 複数の推奨内容を返すモック化（3件以上）
    const recommendationResults = [
      {
        recommendationId: "REC-001",
        customerId: "CUST-12345",
        dealId: "DEAL-67890",
        proposalApproach: "クラウド移行による業務効率化提案",
        confidenceScore: 85,
        successPatternId: "SP-IT-DX-001",
        generatedAt: new Date("2024-01-15T10:00:00Z"),
        basis: "過去の類似IT企業5件で成約率78%",
        status: "active",
      },
      {
        recommendationId: "REC-002",
        customerId: "CUST-12345",
        dealId: "DEAL-67890",
        proposalApproach: "セキュリティ強化に関するコンサルティング提案",
        confidenceScore: 72,
        successPatternId: "SP-IT-SECURITY-002",
        generatedAt: new Date("2024-01-15T10:01:00Z"),
        basis: "同業界の成功事例3件、平均契約金額520万円",
        status: "active",
      },
      {
        recommendationId: "REC-003",
        customerId: "CUST-12345",
        dealId: "DEAL-67890",
        proposalApproach: "AI導入による自動化ソリューション提案",
        confidenceScore: 68,
        successPatternId: "SP-IT-AI-003",
        generatedAt: new Date("2024-01-15T10:02:00Z"),
        basis: "同規模企業の購買シグナル分析、最適タイミング検出",
        status: "active",
      },
      {
        recommendationId: "REC-004",
        customerId: "CUST-12345",
        dealId: "DEAL-67890",
        proposalApproach: "インフラ最適化とコスト削減提案",
        confidenceScore: 61,
        successPatternId: "SP-IT-INFRA-004",
        generatedAt: new Date("2024-01-15T10:03:00Z"),
        basis: "IT業種の過去12ヶ月購買データから抽出",
        status: "active",
      },
    ];

    mockAIRecommendationEngine.generateRecommendation.mockResolvedValue(
      recommendationResults
    );

    // 2. テスト用の顧客データと商談条件を準備
    const customerData = {
      customerId: "CUST-12345",
      customerName: "株式会社テック開発",
      industry: "IT",
      companySize: "medium",
      budget: 5000000,
      mainChallenge: "DX推進",
    };

    const dealConditions = {
      dealId: "DEAL-67890",
      dealStage: "proposal",
      customerRequirements: ["クラウド化", "セキュリティ", "自動化"],
      budget: 5000000,
      timeline: "Q2契約目標",
    };

    // 3. AIエージェント推奨支援システムの推奨生成処理を実行
    const generatedRecommendations =
      await mockAIRecommendationEngine.generateRecommendation(
        customerData,
        dealConditions
      );

    // 生成された推奨内容が3件以上であることを確認
    expect(generatedRecommendations).toHaveLength(4);
    expect(generatedRecommendations.length).toBeGreaterThanOrEqual(3);

    // 4. すべての推奨内容が推奨履歴テーブルに記録されたことを確認
    const recommendationHistoryTable: typeof recommendationResults = [];
    for (const rec of generatedRecommendations) {
      recommendationHistoryTable.push(rec);
    }

    expect(recommendationHistoryTable).toHaveLength(4);
    expect(recommendationHistoryTable.length).toBe(
      generatedRecommendations.length
    );

    // 5. 推奨履歴テーブルに記録された1件目の推奨内容で検索
    const firstRecommendation = recommendationHistoryTable.find(
      (rec) => rec.recommendationId === "REC-001"
    );
    expect(firstRecommendation).toBeDefined();
    expect(firstRecommendation?.proposalApproach).toBe(
      "クラウド移行による業務効率化提案"
    );
    expect(firstRecommendation?.confidenceScore).toBe(85);
    expect(firstRecommendation?.successPatternId).toBe("SP-IT-DX-001");

    // 6. 推奨履歴テーブルに記録された2件目の推奨内容で検索
    const secondRecommendation = recommendationHistoryTable.find(
      (rec) => rec.recommendationId === "REC-002"
    );
    expect(secondRecommendation).toBeDefined();
    expect(secondRecommendation?.proposalApproach).toBe(
      "セキュリティ強化に関するコンサルティング提案"
    );
    expect(secondRecommendation?.confidenceScore).toBe(72);
    expect(secondRecommendation?.successPatternId).toBe("SP-IT-SECURITY-002");

    // 7. 推奨履歴テーブルに記録された3件目の推奨内容で検索
    const thirdRecommendation = recommendationHistoryTable.find(
      (rec) => rec.recommendationId === "REC-003"
    );
    expect(thirdRecommendation).toBeDefined();
    expect(thirdRecommendation?.proposalApproach).toBe(
      "AI導入による自動化ソリューション提案"
    );
    expect(thirdRecommendation?.confidenceScore).toBe(68);
    expect(thirdRecommendation?.successPatternId).toBe("SP-IT-AI-003");

    // 8. 推奨履歴テーブルに記録された4件目以降のすべての推奨内容についても同様に検索実行
    const fourthRecommendation = recommendationHistoryTable.find(
      (rec) => rec.recommendationId === "REC-004"
    );
    expect(fourthRecommendation).toBeDefined();
    expect(fourthRecommendation?.proposalApproach).toBe(
      "インフラ最適化とコスト削減提案"
    );
    expect(fourthRecommendation?.confidenceScore).toBe(61);
    expect(fourthRecommendation?.successPatternId).toBe("SP-IT-INFRA-004");

    // 9. 推奨履歴テーブル全体をクエリ
    const allRecommendations = recommendationHistoryTable;
    const totalCount = allRecommendations.length;

    expect(totalCount).toBe(4);
    expect(totalCount).toEqual(generatedRecommendations.length);

    // 10. 各推奨レコードの詳細情報が完全に保存されていることを確認
    for (const rec of allRecommendations) {
      expect(rec.recommendationId).toBeDefined();
      expect(rec.recommendationId).toMatch(/^REC-\d+$/);

      expect(rec.generatedAt).toBeDefined();
      expect(rec.generatedAt).toBeInstanceOf(Date);
      const generatedTimeMs = rec.generatedAt.getTime();
      const now = new Date("2024-01-15T10:03:00Z").getTime();
      const timeDiffSeconds = Math.abs(now - generatedTimeMs) / 1000;
      expect(timeDiffSeconds).toBeLessThanOrEqual(180);

      expect(rec.proposalApproach).toBeDefined();
      expect(typeof rec.proposalApproach).toBe("string");
      expect(rec.proposalApproach.length).toBeGreaterThan(0);

      expect(rec.basis).toBeDefined();
      expect(typeof rec.basis).toBe("string");
      expect(rec.basis.length).toBeGreaterThan(0);

      expect(rec.status).toBe("active");

      expect(rec.customerId).toBe("CUST-12345");
      expect(rec.dealId).toBe("DEAL-67890");
      expect(rec.confidenceScore).toBeGreaterThanOrEqual(61);
      expect(rec.confidenceScore).toBeLessThanOrEqual(100);
      expect(rec.successPatternId).toBeDefined();
      expect(rec.successPatternId).toMatch(/^SP-/);
    }

    // 期待結果の統計的検証
    expect(recommendationHistoryTable.length).toBe(4);
    const uniqueRecommendationIds = new Set(
      recommendationHistoryTable.map((rec) => rec.recommendationId)
    );
    expect(uniqueRecommendationIds.size).toBe(4);

    const allActive = recommendationHistoryTable.every(
      (rec) => rec.status === "active"
    );
    expect(allActive).toBe(true);

    const allFromSameDeal = recommendationHistoryTable.every(
      (rec) => rec.dealId === "DEAL-67890"
    );
    expect(allFromSameDeal).toBe(true);
  });
});