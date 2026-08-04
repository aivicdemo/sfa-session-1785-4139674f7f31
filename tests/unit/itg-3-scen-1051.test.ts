import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("過去成功パターン抽出・新規案件への適用推奨機能", () => {
  test("SCEN-1051: 複数の提案アプローチが候補として返却される", async () => {
    // AIRecommendationEngine のスタブを定義
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    // 過去成功パターンのモックデータ（3件以上）
    const similarPatterns = [
      {
        patternId: "PAT-001",
        customerId: "CUST-A",
        industry: "製造業",
        issue: "生産効率化",
        budgetRange: "1000万円",
        successRate: 0.92,
        approachType: "段階的導入型",
      },
      {
        patternId: "PAT-002",
        customerId: "CUST-B",
        industry: "製造業",
        issue: "生産効率化",
        budgetRange: "1500万円",
        successRate: 0.88,
        approachType: "一括導入型",
      },
      {
        patternId: "PAT-003",
        customerId: "CUST-C",
        industry: "製造業",
        issue: "生産効率化",
        budgetRange: "800万円",
        successRate: 0.85,
        approachType: "コンサルティング型",
      },
      {
        patternId: "PAT-004",
        customerId: "CUST-D",
        industry: "製造業",
        issue: "生産効率化",
        budgetRange: "1200万円",
        successRate: 0.80,
        approachType: "段階的導入型",
      },
    ];

    // 新規案件データ
    const newDealData = {
      dealId: "DEAL-NEW-001",
      customerId: "CUST-NEW",
      industry: "製造業",
      issue: "生産効率化",
      budgetAmount: 10000000,
      dealStage: "初期提案",
    };

    // findSimilarPatterns のモック設定
    mockAIEngine.findSimilarPatterns.mockResolvedValue(similarPatterns);

    // evaluatePatternRelevance のモック設定（各パターンについて適用可能性スコアを返す）
    mockAIEngine.evaluatePatternRelevance
      .mockResolvedValueOnce({ patternId: "PAT-001", relevanceScore: 0.91 })
      .mockResolvedValueOnce({ patternId: "PAT-002", relevanceScore: 0.87 })
      .mockResolvedValueOnce({ patternId: "PAT-003", relevanceScore: 0.84 })
      .mockResolvedValueOnce({ patternId: "PAT-004", relevanceScore: 0.82 });

    // generateRecommendation のモック設定（複数の提案アプローチを返す）
    const expectedRecommendations = [
      {
        approachId: "APP-001",
        approachName: "段階的導入型",
        basePatternId: "PAT-001",
        relevanceScore: 0.91,
        estimatedConversionRate: 0.92,
      },
      {
        approachId: "APP-002",
        approachName: "一括導入型",
        basePatternId: "PAT-002",
        relevanceScore: 0.87,
        estimatedConversionRate: 0.88,
      },
      {
        approachId: "APP-003",
        approachName: "コンサルティング型",
        basePatternId: "PAT-003",
        relevanceScore: 0.84,
        estimatedConversionRate: 0.85,
      },
    ];

    mockAIEngine.generateRecommendation.mockResolvedValue(
      expectedRecommendations
    );

    // テスト対象関数を呼び出す
    const result = await generateRecommendation(newDealData, mockAIEngine);

    // 検証: レスポンスが配列であること
    expect(Array.isArray(result)).toBe(true);

    // 検証: 最低2件以上の異なるアプローチが含まれること
    expect(result.length).toBeGreaterThanOrEqual(2);

    // 検証: 各アプローチが必要な属性を含むこと
    result.forEach((approach) => {
      expect(approach).toHaveProperty("approachId");
      expect(approach).toHaveProperty("approachName");
      expect(approach).toHaveProperty("basePatternId");
      expect(approach).toHaveProperty("relevanceScore");
      expect(approach).toHaveProperty("estimatedConversionRate");
    });

    // 検証: アプローチ名が期待値と一致すること
    expect(result[0].approachName).toBe("段階的導入型");
    expect(result[1].approachName).toBe("一括導入型");
    expect(result[2].approachName).toBe("コンサルティング型");

    // 検証: 根拠となった過去成功パターンのID が設定されていること
    expect(result[0].basePatternId).toBe("PAT-001");
    expect(result[1].basePatternId).toBe("PAT-002");
    expect(result[2].basePatternId).toBe("PAT-003");

    // 検証: 適用可能性スコアが 0.8 以上であること
    result.forEach((approach) => {
      expect(approach.relevanceScore).toBeGreaterThanOrEqual(0.8);
    });

    // 検証: 想定される成約確度が設定されていること
    result.forEach((approach) => {
      expect(approach.estimatedConversionRate).toBeGreaterThan(0);
      expect(approach.estimatedConversionRate).toBeLessThanOrEqual(1);
    });

    // 検証: スコアの高い順にソートされていること
    for (let i = 0; i < result.length - 1; i++) {
      expect(result[i].relevanceScore).toBeGreaterThanOrEqual(
        result[i + 1].relevanceScore
      );
    }

    // 検証: 最初のアプローチのスコアが最も高いこと
    expect(result[0].relevanceScore).toBe(0.91);
    expect(result[1].relevanceScore).toBe(0.87);
    expect(result[2].relevanceScore).toBe(0.84);

    // 検証: 成約確度の値が妥当であること
    expect(result[0].estimatedConversionRate).toBe(0.92);
    expect(result[1].estimatedConversionRate).toBe(0.88);
    expect(result[2].estimatedConversionRate).toBe(0.85);
  });
});