import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨 - 契約金額欠落時の処理', () => {
  test('SCEN-2056: 契約金額が欠落している場合、他の条件でマッチング処理を継続し推奨内容を生成する', async () => {
    // 過去成功商談データ（推奨パターンマスタ用）
    const successPatternMaster = [
      {
        patternId: 'pattern_001',
        industryType: '製造業',
        dealSize: '中規模',
        proposalContent: '業務効率化ツール導入',
        contractAmount: 5000000,
        conclusionStatus: true,
        relevantscore: 0.85,
      },
      {
        patternId: 'pattern_002',
        industryType: '製造業',
        dealSize: '中規模',
        proposalContent: '業務効率化ツール導入',
        contractAmount: 4500000,
        conclusionStatus: true,
        relevantscore: 0.82,
      },
      {
        patternId: 'pattern_003',
        industryType: '製造業',
        dealSize: '中規模',
        proposalContent: '業務効率化ツール導入',
        contractAmount: 5500000,
        conclusionStatus: true,
        relevantscore: 0.88,
      },
      {
        patternId: 'pattern_004',
        industryType: 'IT業界',
        dealSize: '大規模',
        proposalContent: 'クラウド移行',
        contractAmount: 8000000,
        conclusionStatus: true,
        relevantscore: 0.75,
      },
      {
        patternId: 'pattern_005',
        industryType: '卸売業',
        dealSize: '小規模',
        proposalContent: '在庫管理システム導入',
        contractAmount: 2000000,
        conclusionStatus: false,
        relevantscore: 0.60,
      },
    ];

    // 新規案件の商談条件（契約金額は null で欠落）
    const newDealCondition = {
      industryType: '製造業',
      dealSize: '中規模',
      proposalContent: '業務効率化ツール導入',
      contractAmount: null,
    };

    // AIRecommendationEngine のスタブ
    const mockFindSimilarPatterns = jest.fn().mockResolvedValue([
      successPatternMaster[0],
      successPatternMaster[1],
      successPatternMaster[2],
    ]);

    const mockEvaluatePatternRelevance = jest.fn().mockResolvedValue([
      { patternId: 'pattern_001', applicabilityScore: 0.85 },
      { patternId: 'pattern_002', applicabilityScore: 0.82 },
      { patternId: 'pattern_003', applicabilityScore: 0.88 },
    ]);

    const mockExplainRecommendationReasoning = jest.fn().mockResolvedValue(
      '同業種・同規模での成功事例から提案資料をカスタマイズ。初回ヒアリングで予算感を把握後に提案内容を調整することを推奨'
    );

    const mockAIRecommendationEngine = {
      findSimilarPatterns: mockFindSimilarPatterns,
      evaluatePatternRelevance: mockEvaluatePatternRelevance,
      explainRecommendationReasoning: mockExplainRecommendationReasoning,
    };

    // 推奨生成関数を呼び出し
    const result = await generateRecommendation(
      newDealCondition,
      successPatternMaster,
      mockAIRecommendationEngine
    );

    // 期待値：契約金額フィルタを除いた他3条件でマッチングされた3件が抽出される
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(
      expect.objectContaining({
        industryType: '製造業',
        dealSize: '中規模',
        proposalContent: '業務効率化ツール導入',
        contractAmount: null,
      }),
      successPatternMaster
    );

    // 適用可能スコアが0.8以上で返される
    expect(mockEvaluatePatternRelevance).toHaveBeenCalled();
    const evaluationResult = await mockEvaluatePatternRelevance();
    expect(evaluationResult).toHaveLength(3);
    expect(evaluationResult[0].applicabilityScore).toBeGreaterThanOrEqual(0.8);
    expect(evaluationResult[1].applicabilityScore).toBeGreaterThanOrEqual(0.8);
    expect(evaluationResult[2].applicabilityScore).toBeGreaterThanOrEqual(0.8);

    // 根拠説明が生成される
    expect(mockExplainRecommendationReasoning).toHaveBeenCalled();
    const reasoning = await mockExplainRecommendationReasoning();
    expect(reasoning).toBe(
      '同業種・同規模での成功事例から提案資料をカスタマイズ。初回ヒアリングで予算感を把握後に提案内容を調整することを推奨'
    );

    // 推奨結果が正常に生成されている
    expect(result).toEqual({
      status: 'success',
      matchedPatternCount: 3,
      recommendedApproach: expect.stringContaining('提案資料をカスタマイズ'),
      reasoning: '同業種・同規模での成功事例から提案資料をカスタマイズ。初回ヒアリングで予算感を把握後に提案内容を調整することを推奨',
      averageApplicabilityScore: expect.closeTo(0.85, 2),
      errorDisplay: null,
    });
  });
});