import {
  generateRecommendation,
  findSimilarPatterns,
  evaluatePatternRelevance,
} from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出と提案アプローチ推奨機能", () => {
  // SCEN-2226
  test("[normal] 適用可能な提案アプローチが自動推奨される", async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 過去成功事例のモック: 3件を類似度スコア付きで返す
    const pastSuccessCases = [
      {
        caseId: "CASE-001",
        industry: "製造業",
        challenge: "生産効率化",
        budgetScale: "中規模",
        approach: "段階的導入による初期投資最小化アプローチ",
        similarityScore: 0.92,
      },
      {
        caseId: "CASE-002",
        industry: "製造業",
        challenge: "品質向上",
        budgetScale: "中規模",
        approach: "品質管理システム統合アプローチ",
        similarityScore: 0.68,
      },
      {
        caseId: "CASE-003",
        industry: "流通業",
        challenge: "生産効率化",
        budgetScale: "大規模",
        approach: "フルスケール自動化アプローチ",
        similarityScore: 0.55,
      },
    ];

    mockAIEngine.findSimilarPatterns.mockResolvedValue(pastSuccessCases);

    // 各パターンの適用可能スコア（0.0～1.0）を返すモック
    const relevanceScores = {
      "CASE-001": 0.85,
      "CASE-002": 0.62,
      "CASE-003": 0.48,
    };

    mockAIEngine.evaluatePatternRelevance.mockImplementation(
      (caseId: string) => {
        return Promise.resolve(relevanceScores[caseId as keyof typeof relevanceScores] || 0);
      }
    );

    // 推奨結果のモック: 適用可能スコア0.75以上のみフィルタリング、降順ソート
    const recommendedApproaches = [
      {
        approachId: "APPROACH-001",
        title: "段階的導入による初期投資最小化アプローチ",
        relevanceScore: 0.85,
        relatedCaseId: "CASE-001",
        reasoning:
          "製造業での生産効率化課題に対して、過去事例CASE-001と同一の業種・課題・予算規模であり、段階的な導入で初期投資を抑えながら効果を検証できるアプローチ",
        recommendationReasoning:
          "新規案件の顧客属性（業種：製造業、課題：生産効率化、予算規模：中規模）と高い適合度を示しており、過去の成功実績に基づいた推奨",
      },
    ];

    mockAIEngine.generateRecommendation.mockResolvedValue({
      recommendationId: "REC-20240115-001",
      customerId: "CUST-NEW-001",
      dealId: "DEAL-NEW-001",
      customerInfo: {
        industry: "製造業",
        challenge: "生産効率化",
        budgetScale: "中規模",
      },
      recommendedApproaches,
      generatedAt: new Date("2024-01-15T11:00:00Z"),
    });

    // 新規案件の顧客情報を入力
    const newDealInput = {
      customerId: "CUST-NEW-001",
      dealId: "DEAL-NEW-001",
      industry: "製造業",
      challenge: "生産効率化",
      budgetScale: "中規模",
    };

    // 推奨生成処理を実行
    const result = await generateRecommendation(newDealInput, mockAIEngine);

    // 戻り値の推奨アプローチが適用可能スコア0.75以上のみ含まれていることを確認
    expect(result.recommendedApproaches).toHaveLength(1);
    expect(result.recommendedApproaches[0].relevanceScore).toBeGreaterThanOrEqual(
      0.75
    );

    // 推奨アプローチが顧客の業種・課題・予算規模に合致していることを確認
    const topApproach = result.recommendedApproaches[0];
    expect(topApproach.title).toBe(
      "段階的導入による初期投資最小化アプローチ"
    );
    expect(topApproach.reasoning).toMatch(/製造業/);
    expect(topApproach.reasoning).toMatch(/生産効率化/);
    expect(topApproach.reasoning).toMatch(/中規模/);

    // 推奨内容に複数の候補アプローチが降順（高スコア順）で並んでいることを確認
    for (let i = 0; i < result.recommendedApproaches.length - 1; i++) {
      expect(
        result.recommendedApproaches[i].relevanceScore
      ).toBeGreaterThanOrEqual(
        result.recommendedApproaches[i + 1].relevanceScore
      );
    }

    // 各推奨アプローチに対して根拠情報が紐付けられていることを確認
    result.recommendedApproaches.forEach((approach) => {
      expect(approach.relatedCaseId).toBeDefined();
      expect(approach.relatedCaseId).toMatch(/^CASE-/);
      expect(approach.reasoning).toBeDefined();
      expect(approach.reasoning.length).toBeGreaterThan(0);
      expect(approach.recommendationReasoning).toBeDefined();
      expect(approach.recommendationReasoning.length).toBeGreaterThan(0);
    });

    // generateRecommendation が正しい入力で呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "CUST-NEW-001",
        dealId: "DEAL-NEW-001",
        industry: "製造業",
        challenge: "生産効率化",
        budgetScale: "中規模",
      }),
      expect.any(Object)
    );

    // 結果の基本構造を確認
    expect(result.recommendationId).toBeDefined();
    expect(result.customerId).toBe("CUST-NEW-001");
    expect(result.dealId).toBe("DEAL-NEW-001");
    expect(result.customerInfo).toEqual({
      industry: "製造業",
      challenge: "生産効率化",
      budgetScale: "中規模",
    });
    expect(result.generatedAt).toEqual(new Date("2024-01-15T11:00:00Z"));
  });
});