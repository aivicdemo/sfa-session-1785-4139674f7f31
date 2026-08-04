import { evaluateDataQualityScoringAndGuidance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 営業指導方針決定', () => {
  // SCEN-542: [edge] 営業指導方針決定機能 - データ品質スコアがちょうど合格ライン50のとき指導方針が要改善になる
  test('データ品質スコアが50（合格ラインの下限値）のとき、指導方針が要改善になること', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        qualityScore: 50,
        isApplicable: true,
      }),
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const testData = {
      customerId: 'CUST_001',
      businessIssue: '営業プロセス効率化',
      industryType: 'IT',
      companyScale: 'LARGE',
      dealAmount: 5000000,
      dealStage: 'PROPOSAL',
    };

    const result = evaluateDataQualityScoringAndGuidance(
      testData,
      mockAIRecommendationEngine
    );

    expect(result.guidancePolicy).toBe('NEEDS_IMPROVEMENT');
    expect(result.qualityScore).toBe(50);
    expect(result.isApplicableForRecommendation).toBe(true);

    const result_above_50 = evaluateDataQualityScoringAndGuidance(
      { ...testData },
      {
        ...mockAIRecommendationEngine,
        evaluatePatternRelevance: jest
          .fn()
          .mockReturnValue({
            qualityScore: 51,
            isApplicable: true,
          }),
      }
    );

    expect(result_above_50.guidancePolicy).not.toBe('NEEDS_IMPROVEMENT');
  });
});