import { findSimilarPatternsAndRecommend } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と提案アプローチ自動推奨', () => {
  // SCEN-1549
  test('新規案件の顧客情報が欠けている場合、提案アプローチ推奨処理は実行されず空結果が返却される', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
    };

    const mockLogger = {
      info: jest.fn(),
      debug: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    const incompleteCustomerData = {
      customerName: null,
      industry: '',
      companySize: 'medium',
    };

    const dealData = {
      dealId: 'DEAL-20240115-001',
      customer: incompleteCustomerData,
      dealAmount: 5000000,
      stage: 'initial_contact',
      createdAt: '2024-01-15T10:00:00Z',
    };

    const result = findSimilarPatternsAndRecommend(
      dealData,
      mockAIRecommendationEngine,
      mockLogger
    );

    expect(result).toEqual({
      recommendations: [],
      patterns: [],
      reasoning: null,
    });

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringMatching(/顧客情報が不完全のため推奨処理をスキップ/)
    );
  });
});