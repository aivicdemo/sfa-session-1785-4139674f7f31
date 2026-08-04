import { calculateRecommendationAccuracy } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  test('SCEN-2431: 推奨精度スコア算出機能 - 過去成功パターンが降順でソートされているとき最高スコアが先頭で返却される', () => {
    const mockSimilarPatterns = [
      {
        patternId: 'pattern_a_001',
        patternName: 'Pattern A',
        similarityScore: 0.95,
        successRate: 0.88,
        applicableIndustries: ['IT', 'Finance'],
        dealAmount: 5000000,
        decisionMakers: 3,
      },
      {
        patternId: 'pattern_b_002',
        patternName: 'Pattern B',
        similarityScore: 0.87,
        successRate: 0.82,
        applicableIndustries: ['Manufacturing'],
        dealAmount: 3000000,
        decisionMakers: 2,
      },
      {
        patternId: 'pattern_c_003',
        patternName: 'Pattern C',
        similarityScore: 0.72,
        successRate: 0.75,
        applicableIndustries: ['Retail'],
        dealAmount: 1500000,
        decisionMakers: 1,
      },
    ];

    const newDealCondition = {
      customerIndustry: 'IT',
      dealAmount: 4800000,
      decisionMakersCount: 3,
      salesCycleMonths: 6,
      budgetApprovalStatus: 'approved',
    };

    const mockAIRecommendationEngine = {
      findSimilarPatterns: jest.fn().mockReturnValue(mockSimilarPatterns),
    };

    const result = calculateRecommendationAccuracy(
      newDealCondition,
      mockAIRecommendationEngine
    );

    expect(result.highestAccuracyScore).toBe(0.95);
    expect(result.topPattern.patternId).toBe('pattern_a_001');
    expect(result.topPattern.patternName).toBe('Pattern A');
    expect(result.topPattern.similarityScore).toBe(0.95);
    expect(mockAIRecommendationEngine.findSimilarPatterns).toHaveBeenCalledWith(
      newDealCondition
    );
  });
});