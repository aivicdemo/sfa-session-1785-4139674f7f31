import { evaluateInferenceAccuracy } from '../../src/logic/it-1-br-3-3-2-1';

describe('推論精度スコア算出機能', () => {
  test('SCEN-2399: 新規案件の顧客条件がnullのとき、エラーが発生する', () => {
    const newCasePlan = {
      caseId: 'CASE-001',
      customerId: 'CUST-001',
      customerCondition: null,
      dealAmount: 500000,
      dealStage: 'proposal',
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
    };

    const aiRecommendationEngineStub = {
      findSimilarPatterns: jest.fn(),
      generateRecommendation: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      evaluateInferenceAccuracy(newCasePlan, aiRecommendationEngineStub)
    ).toThrow(/customerCondition/);
  });
});