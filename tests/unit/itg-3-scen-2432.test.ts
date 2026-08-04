import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2432
  test('推奨精度スコア算出機能 - 過去成功パターンが昇順でソートされているとき最高スコアが返却される', () => {
    const pastSuccessPatterns = [
      {
        patternId: 'パターンA',
        relevanceScore: 0.65,
        description: 'Pattern A with lower score',
      },
      {
        patternId: 'パターンB',
        relevanceScore: 0.78,
        description: 'Pattern B with medium score',
      },
      {
        patternId: 'パターンC',
        relevanceScore: 0.92,
        description: 'Pattern C with highest score',
      },
    ];

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(pastSuccessPatterns),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const newCaseCondition = {
      customerId: 'CUST-001',
      industryType: 'Manufacturing',
      companySize: 'Large',
      dealValue: 5000000,
    };

    const result = evaluatePatternRelevance(
      newCaseCondition,
      mockAIRecommendationEngine
    );

    expect(result.maxRelevanceScore).toBe(0.92);
    expect(result.highestScoringPatternId).toBe('パターンC');
  });
});