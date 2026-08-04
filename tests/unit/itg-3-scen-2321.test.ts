import { evaluateRecommendationRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2321: [edge] 新規案件と過去成功パターンの類似度スコアが適用可能閾値直上のとき提案アプローチが推奨される
  test('類似度スコアが閾値直上（0.751）のとき推奨提案アプローチが返却される', async () => {
    const newDealData = {
      industryType: 'IT企業',
      challenge: 'DX推進',
      budget: 50000000,
      decisionMakerCount: 3,
    };

    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.751),
      findSimilarPatterns: jest.fn().mockResolvedValue({
        patternId: 'pattern_001',
        patternName: 'エンタープライズ向けコンサルティング提案アプローチ',
        similarityScore: 0.751,
      }),
      generateRecommendation: jest.fn().mockResolvedValue({
        approach: '段階的導入プラン（Phase1：課題分析、Phase2：概念実証、Phase3：本格導入）',
        rationale: '過去同一条件の案件で成約率87%',
      }),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '本案件は過去のIT企業DX推進案件と類似度75.1%で合致。段階的導入により意思決定者間の合意形成が効率化され、成約率が向上する',
      ),
    };

    const result = await evaluateRecommendationRelevance(newDealData, mockAIEngine);

    expect(result.similarityScore).toBe(0.751);
    expect(result.isRecommended).toBe(true);
    expect(result.recommendedApproach).toBe(
      '段階的導入プラン（Phase1：課題分析、Phase2：概念実証、Phase3：本格導入）',
    );
    expect(result.reasoning).toContain('本案件は過去のIT企業DX推進案件と類似度75.1%で合致');
    expect(result.reasoning).toContain('段階的導入により意思決定者間の合意形成が効率化され');
    expect(result.reasoning).toContain('成約率が向上する');
    expect(result.successRate).toBe(87);
  });
});