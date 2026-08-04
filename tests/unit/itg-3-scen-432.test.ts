import { decideGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針決定機能', () => {
  test('SCEN-432: 改善対象項目が1件の場合、該当項目が方針に正しく含まれる', () => {
    const salesPersonId = 'SP001';
    const dealId = 'DEAL20240115001';
    const improvementTargetItems = ['顧客対応品質'];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        policyContent: '顧客対応品質の向上が必須です。初回接触時の傾聴スキルとフォローアップの迅速性を改善してください。',
        applicableTargetItems: ['顧客対応品質'],
        confidenceScore: 92,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = decideGuidancePolicy(
      {
        salesPersonId,
        dealId,
        improvementTargetItems,
      },
      mockAIRecommendationEngine
    );

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledTimes(1);

    expect(result.policyContent).toContain('顧客対応品質');

    expect(result.applicableTargetItems).toHaveLength(1);
    expect(result.applicableTargetItems[0]).toBe('顧客対応品質');
  });
});