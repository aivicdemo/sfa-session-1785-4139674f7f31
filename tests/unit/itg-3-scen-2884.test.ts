import { validateRecommendationContent } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨内容検証判定機能 - 顧客属性バリデーション', () => {
  // SCEN-2884
  test('新規案件の顧客属性が空のとき、エラーを返す', () => {
    const newDealData = {
      dealId: 'DEAL-20240115-001',
      customerAttributes: null,
      dealConditions: {
        industry: 'IT',
        companySize: 'large',
        budgetRange: 'high',
      },
      proposedApproach: 'strategic partnership',
      dealStage: 'qualification',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() => {
      validateRecommendationContent(newDealData, mockAIEngine);
    }).toThrow(/顧客属性/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});