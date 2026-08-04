import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターンマッチング機能 - 顧客属性未設定時のエラーハンドリング', () => {
  test('SCEN-2650: 顧客属性が未設定のとき、マッチングエラーが発生する', () => {
    const newCaseInput = {
      caseId: 'CASE-20240115-001',
      caseName: '新規案件A',
      amount: 5000000,
      customerIndustry: undefined,
      customerScale: undefined,
      decisionMakerAttribute: undefined,
      proposedApproach: null,
      successPatternId: null
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        throw new Error('CustomerAttributeMissingError: Required customer attributes not provided');
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    expect(() => {
      generateRecommendation(newCaseInput, mockAIRecommendationEngine);
    }).toThrow(/顧客属性/);
  });
});