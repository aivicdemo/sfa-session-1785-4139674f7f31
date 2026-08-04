import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出・照合機能', () => {
  // SCEN-2268
  test('推奨パターンマスタが0件のとき、提案アプローチ推奨がエラーになる', () => {
    const newDealData = {
      customerId: 'CUST_001',
      customerIndustry: '製造業',
      customerScale: '大企業',
      dealCondition: '新規顧客、初回商談',
      dealAmount: 5000000,
      dealStage: '提案段階'
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        throw new Error('PATTERN_MASTER_EMPTY');
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const mockPatternMaster = {
      getSuccessPatterns: jest.fn().mockReturnValue([])
    };

    expect(() => {
      generateRecommendation(
        newDealData,
        mockAIEngine,
        mockPatternMaster
      );
    }).toThrow(/PATTERN_MASTER_EMPTY/);
  });
});