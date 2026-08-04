import { evaluatePatternRelevanceScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン適用可能性評価機能', () => {
  test('SCEN-291: 抽出された成功パターンが0件のとき、適用可能性スコアが0になる', () => {
    const mockFindSimilarPatterns = jest.fn().mockReturnValue([]);
    const mockEvaluatePatternRelevance = jest.fn();

    const dealCondition = {
      customerId: 'CUST-001',
      industryType: 'manufacturing',
      companyScale: 'large',
      budget: 5000000,
      timelineMonths: 3,
    };

    const result = evaluatePatternRelevanceScore(
      dealCondition,
      mockFindSimilarPatterns,
      mockEvaluatePatternRelevance
    );

    expect(result.applicabilityScore).toBe(0);
    expect(mockFindSimilarPatterns).toHaveBeenCalledWith(dealCondition);
    expect(mockEvaluatePatternRelevance).not.toHaveBeenCalled();
    expect(result.status).toBe('completed');
    expect(result.patternCount).toBe(0);
  });
});