import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への推奨機能', () => {
  // SCEN-1342
  test('パターン適用可能スコアがちょうど閾値と一致するとき、推奨対象と判定される', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        score: 0.75,
        isApplicable: true
      })
    };

    const newDealData = {
      customerIndustry: '製造業',
      dealStage: '提案前',
      budgetRange: 5000000
    };

    const result = evaluatePatternRelevance(newDealData, mockAIEngine);

    expect(mockAIEngine.evaluatePatternRelevance).toHaveBeenCalledWith(newDealData);
    expect(result.score).toBe(0.75);
    expect(result.isRecommended).toBe(true);
    expect(result.recommendationStatus).toBe('eligible');
    expect(result.recommendedApproach).toBeDefined();
  });
});