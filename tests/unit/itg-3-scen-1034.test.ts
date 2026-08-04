import { getRecommendedApproach } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの推奨判定', () => {
  // SCEN-1034
  test('提案アプローチが0件の場合、新規生成されるアプローチが推奨される', () => {
    const caseId = 'CASE-20250801-001';
    const newlyGeneratedApproach = {
      approachId: 'NEW-APPROACH-001',
      name: '段階的導入提案',
      confidenceScore: 0.87,
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(newlyGeneratedApproach),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = getRecommendedApproach(caseId, mockAIEngine, []);

    expect(result.recommendedApproach).toEqual({
      approachId: 'NEW-APPROACH-001',
      name: '段階的導入提案',
      confidenceScore: 0.87,
    });
    expect(result.isNewlyGenerated).toBe(true);
    expect(result.recommendedApproach.approachId).toBe('NEW-APPROACH-001');
  });
});