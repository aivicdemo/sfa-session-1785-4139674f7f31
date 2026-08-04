import { extractSuccessPatternsAndGenerateWeights } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・重み付けルール生成機能", () => {
  test("SCEN-2765: 同じ入力データで2回実行しても同じ重み付けルールが生成される", async () => {
    // テスト用の過去商談データセット
    const historicalDealData = [
      {
        dealId: "DEAL001",
        customerIndustry: "製造業",
        dealAmount: 50000000,
        proposalContent: "生産効率化システム",
        resultStatus: "成約",
        features: {
          industryCode: "MFG",
          budgetRange: "50M",
          challengeType: "efficiency",
        },
      },
      {
        dealId: "DEAL002",
        customerIndustry: "製造業",
        dealAmount: 48000000,
        proposalContent: "自動化ツール導入",
        resultStatus: "成約",
        features: {
          industryCode: "MFG",
          budgetRange: "50M",
          challengeType: "efficiency",
        },
      },
      {
        dealId: "DEAL003",
        customerIndustry: "製造業",
        dealAmount: 30000000,
        proposalContent: "品質管理システム",
        resultStatus: "失注",
        features: {
          industryCode: "MFG",
          budgetRange: "30M",
          challengeType: "quality",
        },
      },
      {
        dealId: "DEAL004",
        customerIndustry: "製造業",
        dealAmount: 52000000,
        proposalContent: "IoTセンサ導入",
        resultStatus: "成約",
        features: {
          industryCode: "MFG",
          budgetRange: "50M",
          challengeType: "efficiency",
        },
      },
    ];

    // 新規案件の条件データ
    const newDealCondition = {
      customerIndustry: "製造業",
      dealAmount: 50000000,
      challenge: "生産効率化",
      features: {
        industryCode: "MFG",
        budgetRange: "50M",
        challengeType: "efficiency",
      },
    };

    // AIRecommendationEngineのスタブ設定
    // 同じ入力に対して常に同じ埋め込みベクトル値を返す
    const mockAIEngine = {
      generateRecommendation: jest.fn(async (input) => ({
        patterns: [
          {
            patternId: "PAT001",
            patternName: "効率化重視型",
            relevanceScore: 0.9234,
          },
          {
            patternId: "PAT002",
            patternName: "予算最適化型",
            relevanceScore: 0.8512,
          },
          {
            patternId: "PAT003",
            patternName: "導入スピード型",
            relevanceScore: 0.7823,
          },
        ],
      })),
      findSimilarPatterns: jest.fn(async (input) => [
        {
          dealId: "DEAL001",
          similarity: 0.9234,
          embedding: [0.1, 0.2, 0.3],
        },
        {
          dealId: "DEAL002",
          similarity: 0.8512,
          embedding: [0.11, 0.21, 0.31],
        },
        {
          dealId: "DEAL004",
          similarity: 0.7823,
          embedding: [0.12, 0.22, 0.32],
        },
      ]),
      explainRecommendationReasoning: jest.fn(async (input) =>
        "製造業の生産効率化ニーズに対し、過去3件の成約事例（DEAL001, DEAL002, DEAL004）から抽出した成功パターンを基に、効率化重視型を最優先として推奨。予算50M帯での実績が豊富で、導入期間も標準的。"
      ),
      evaluatePatternRelevance: jest.fn(async (input) => ({
        scoreValue: 0.8523,
        weightCoefficient: 1.25,
        applicabilityOrder: 1,
      })),
    };

    // 1回目実行
    const firstExecutionResult = await extractSuccessPatternsAndGenerateWeights(
      historicalDealData,
      newDealCondition,
      mockAIEngine
    );

    // 1回目の実行結果から生成された重み付けルール
    const firstWeightingRule = firstExecutionResult.weightingRules;
    const firstExplanation = firstExecutionResult.explanation;

    // 期待値：1回目の重み付けルール構造
    expect(firstWeightingRule).toEqual({
      patterns: [
        {
          patternId: "PAT001",
          patternName: "効率化重視型",
          scoreValue: 0.9234,
          weightCoefficient: 1.25,
          applicabilityOrder: 1,
        },
        {
          patternId: "PAT002",
          patternName: "予算最適化型",
          scoreValue: 0.8512,
          weightCoefficient: 1.15,
          applicabilityOrder: 2,
        },
        {
          patternId: "PAT003",
          patternName: "導入スピード型",
          scoreValue: 0.7823,
          weightCoefficient: 1.05,
          applicabilityOrder: 3,
        },
      ],
    });

    // 1回目の根拠説明文
    expect(firstExplanation).toBe(
      "製造業の生産効率化ニーズに対し、過去3件の成約事例（DEAL001, DEAL002, DEAL004）から抽出した成功パターンを基に、効率化重視型を最優先として推奨。予算50M帯での実績が豊富で、導入期間も標準的。"
    );

    // 2回目実行（同じ新規案件条件で）
    const secondExecutionResult =
      await extractSuccessPatternsAndGenerateWeights(
        historicalDealData,
        newDealCondition,
        mockAIEngine
      );

    // 2回目の実行結果から生成された重み付けルール
    const secondWeightingRule = secondExecutionResult.weightingRules;
    const secondExplanation = secondExecutionResult.explanation;

    // 1回目と2回目の重み付けルールを項目ごと比較
    // パターンID、スコア値、ウェイト係数、適用優先度の順序が完全に一致
    expect(secondWeightingRule.patterns.length).toBe(
      firstWeightingRule.patterns.length
    );

    for (let i = 0; i < firstWeightingRule.patterns.length; i++) {
      const firstPattern = firstWeightingRule.patterns[i];
      const secondPattern = secondWeightingRule.patterns[i];

      // パターンID一致
      expect(secondPattern.patternId).toBe(firstPattern.patternId);

      // パターン名一致
      expect(secondPattern.patternName).toBe(firstPattern.patternName);

      // スコア値一致（小数点第4位まで）
      expect(secondPattern.scoreValue).toBeCloseTo(
        firstPattern.scoreValue,
        4
      );

      // ウェイト係数一致
      expect(secondPattern.weightCoefficient).toBe(
        firstPattern.weightCoefficient
      );

      // 適用優先度一致
      expect(secondPattern.applicabilityOrder).toBe(
        firstPattern.applicabilityOrder
      );
    }

    // 根拠説明文も同一
    expect(secondExplanation).toBe(firstExplanation);

    // スタブが呼び出されたことを確認
    expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);
    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledTimes(
      2
    );
  });
});