import { evaluateRecommendationAccuracy } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-339
  test('推奨精度検証機能 - 同じ入力条件で精度検証を2回実行した場合、同一の計測結果が返却される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationScore: 87,
        similarityScore: 0.92,
        confidenceScore: 0.89,
        applicabilityScore: 0.85,
        patternId: 'PAT-MFG-500M-PROPOSAL-001',
        reasoning: '製造業の500万円規模案件で提案準備段階における過去の成功パターンと高い類似性を検出',
        basePatterns: ['PAT-MFG-500M-PROPOSAL-001', 'PAT-MFG-500M-PROPOSAL-002'],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-MFG-500M-PROPOSAL-001',
          matchingScore: 0.94,
          successRate: 0.88,
          applicableSegments: ['Manufacturing', '5M_Revenue'],
        },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去3年間の製造業顧客との500万円規模商談において、この段階での提案アプローチが88%の成功率を達成。類似顧客の購買シグナルと現在の顧客状況が92%一致。'
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.89),
    };

    const inputCondition = {
      industry: '製造業',
      dealSize: 5000000,
      dealStage: '提案準備',
      customerId: 'CUST-TEST-001',
      accountManager: 'SALES-USER-001',
    };

    let firstRunResult: any = null;
    let secondRunResult: any = null;

    return evaluateRecommendationAccuracy(inputCondition, mockAIEngine)
      .then((result1) => {
        firstRunResult = result1;
        return evaluateRecommendationAccuracy(inputCondition, mockAIEngine);
      })
      .then((result2) => {
        secondRunResult = result2;

        expect(firstRunResult.recommendationScore).toBe(secondRunResult.recommendationScore);
        expect(firstRunResult.recommendationScore).toBe(87);

        expect(firstRunResult.similarityScore).toBe(secondRunResult.similarityScore);
        expect(firstRunResult.similarityScore).toBe(0.92);

        expect(firstRunResult.confidenceScore).toBe(secondRunResult.confidenceScore);
        expect(firstRunResult.confidenceScore).toBe(0.89);

        expect(firstRunResult.applicabilityScore).toBe(secondRunResult.applicabilityScore);
        expect(firstRunResult.applicabilityScore).toBe(0.85);

        expect(firstRunResult.patternId).toBe(secondRunResult.patternId);
        expect(firstRunResult.patternId).toBe('PAT-MFG-500M-PROPOSAL-001');

        expect(firstRunResult.reasoning).toBe(secondRunResult.reasoning);
        expect(firstRunResult.reasoning).toBe(
          '製造業の500万円規模案件で提案準備段階における過去の成功パターンと高い類似性を検出'
        );

        expect(firstRunResult.basePatterns).toEqual(secondRunResult.basePatterns);
        expect(firstRunResult.basePatterns).toEqual(['PAT-MFG-500M-PROPOSAL-001', 'PAT-MFG-500M-PROPOSAL-002']);

        expect(firstRunResult.successRate).toBe(secondRunResult.successRate);
        expect(firstRunResult.successRate).toBe(0.88);

        expect(mockAIEngine.generateRecommendation).toHaveBeenCalledTimes(2);
        expect(mockAIEngine.findSimilarPatterns).toHaveBeenCalledTimes(2);
        expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledTimes(2);
      });
  });
});