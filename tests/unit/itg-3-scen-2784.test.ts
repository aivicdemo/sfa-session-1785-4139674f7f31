import { extractSuccessPatternsWithWeighting } from '../../src/logic/it-1-br-3-3-2-1';

describe('過去商談データから成功パターンを抽出し、新規案件の顧客・商談条件と照合して適用可能な提案アプローチを自動推奨する機能', () => {
  // SCEN-2784
  test('顧客業種が空文字列のレコードが含まれるとき、エラーを返す', () => {
    const testDataset = [
      {
        customerId: 'C001',
        industry: '',
        dealAmount: 500000,
        closureStatus: 'won',
      },
      {
        customerId: 'C002',
        industry: 'IT',
        dealAmount: 300000,
        closureStatus: 'won',
      },
    ];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    expect(() =>
      extractSuccessPatternsWithWeighting(
        testDataset,
        mockAIRecommendationEngine
      )
    ).toThrow(/顧客業種/);
  });
});