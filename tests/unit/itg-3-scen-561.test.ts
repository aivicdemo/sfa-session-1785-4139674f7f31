import { generateRecommendation } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・照合機能 - 新規案件の商談条件が0個のとき汎用的な提案アプローチが推奨される", () => {
  // SCEN-561
  test("商談条件が空配列のとき、内部パターンマスタから汎用的な提案アプローチを推奨する", () => {
    // 新規案件データを準備（商談条件配列を空配列で設定）
    const newDealInput = {
      customerId: "CUST-20240115-001",
      customerName: "テクノロジー製造業A社",
      industry: "製造業",
      companySize: "大企業",
      dealConditions: [],
      salesStageInfo: {
        currentStage: "初期接触",
        targetClosureDate: "2024-03-31",
      },
    };

    // AIRecommendationEngineのスタブを定義
    const stubAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationType: "GENERIC_APPROACH",
        recommendedPatterns: [
          {
            patternId: "GENERIC_APPROACH_001",
            patternName: "初回ヒアリング重視型提案",
            applicabilityScore: 85,
            successRate: 0.72,
          },
          {
            patternId: "GENERIC_APPROACH_002",
            patternName: "段階的なニーズ発掘型提案",
            applicabilityScore: 82,
            successRate: 0.69,
          },
          {
            patternId: "GENERIC_APPROACH_003",
            patternName: "基礎課題ヒアリング型提案",
            applicabilityScore: 78,
            successRate: 0.65,
          },
        ],
        reasoning:
          "商談条件が不足しているため、基本的で適用範囲の広い提案アプローチを推奨します。顧客の業種は製造業で企業規模が大きいため、層別化された初期ヒアリングと段階的なニーズ発掘が効果的です。",
        confidenceScore: 72,
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // 推奨パターンマスタのスタブ（内部保持データ）
    const patternMasterData = [
      {
        patternId: "GENERIC_APPROACH_001",
        patternName: "初回ヒアリング重視型提案",
        applicabilityScore: 85,
        successRate: 0.72,
      },
      {
        patternId: "GENERIC_APPROACH_002",
        patternName: "段階的なニーズ発掘型提案",
        applicabilityScore: 82,
        successRate: 0.69,
      },
      {
        patternId: "GENERIC_APPROACH_003",
        patternName: "基礎課題ヒアリング型提案",
        applicabilityScore: 78,
        successRate: 0.65,
      },
    ];

    // 新規案件データをgenerateRecommendation関数に入力
    const recommendation = generateRecommendation(
      newDealInput,
      stubAIEngine,
      patternMasterData
    );

    // 生成された推奨結果を検証
    expect(recommendation.recommendationType).toBe("GENERIC_APPROACH");

    // recommendedPatterns配列に汎用パターン（推奨パターンマスタから統計的に上位の2～3件）が含まれることを検証
    expect(recommendation.recommendedPatterns).toHaveLength(3);
    expect(recommendation.recommendedPatterns[0].patternId).toBe(
      "GENERIC_APPROACH_001"
    );
    expect(recommendation.recommendedPatterns[0].patternName).toBe(
      "初回ヒアリング重視型提案"
    );
    expect(recommendation.recommendedPatterns[0].applicabilityScore).toBe(85);
    expect(recommendation.recommendedPatterns[0].successRate).toBe(0.72);

    expect(recommendation.recommendedPatterns[1].patternId).toBe(
      "GENERIC_APPROACH_002"
    );
    expect(recommendation.recommendedPatterns[1].patternName).toBe(
      "段階的なニーズ発掘型提案"
    );
    expect(recommendation.recommendedPatterns[1].applicabilityScore).toBe(82);
    expect(recommendation.recommendedPatterns[1].successRate).toBe(0.69);

    expect(recommendation.recommendedPatterns[2].patternId).toBe(
      "GENERIC_APPROACH_003"
    );
    expect(recommendation.recommendedPatterns[2].patternName).toBe(
      "基礎課題ヒアリング型提案"
    );
    expect(recommendation.recommendedPatterns[2].applicabilityScore).toBe(78);
    expect(recommendation.recommendedPatterns[2].successRate).toBe(0.65);

    // 理由説明（reasoning）に『商談条件が不足しているため、基本的で適用範囲の広い提案アプローチを推奨します』という内容が含まれていることを検証
    expect(recommendation.reasoning).toMatch(/商談条件が不足しているため/);
    expect(recommendation.reasoning).toMatch(/基本的で適用範囲の広い提案アプローチ/);

    // 信頼度スコアが0～100の範囲にあることを検証
    expect(recommendation.confidenceScore).toBe(72);
    expect(recommendation.confidenceScore).toBeGreaterThanOrEqual(0);
    expect(recommendation.confidenceScore).toBeLessThanOrEqual(100);

    // findSimilarPatterns が呼び出されて空配列を返していることを検証（外部AI呼び出しが行われていないことを確認）
    expect(stubAIEngine.findSimilarPatterns).toHaveBeenCalled();
    expect(stubAIEngine.findSimilarPatterns).toHaveReturnedWith([]);

    // 内部の推奨パターンマスタからのみデータが返却されていることを検証
    expect(recommendation.recommendedPatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          patternId: "GENERIC_APPROACH_001",
        }),
        expect.objectContaining({
          patternId: "GENERIC_APPROACH_002",
        }),
        expect.objectContaining({
          patternId: "GENERIC_APPROACH_003",
        }),
      ])
    );
  });
});