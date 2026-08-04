import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチ推奨機能 - 商談条件欠落時の推奨判定', () => {
  // SCEN-155
  test('新規案件の商談条件が欠落している場合、入力値検証段階で処理を中断し、ValidationErrorを返却する', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const incompleteOpportunity = {
      customerName: '株式会社テスト',
      dealAmount: 5000000,
      dealStage: null,
      customerIndustry: '',
      implementationSchedule: null,
    };

    expect(() =>
      generateRecommendation(incompleteOpportunity, mockAIEngine)
    ).toThrow(/商談条件/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
  });
});