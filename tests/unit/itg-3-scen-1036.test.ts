import { generateRecommendation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案アプローチの推奨判定 - 重複排除処理', () => {
  // SCEN-1036
  test('重複を含む提案アプローチ配列が入力されたとき、重複排除後に2件の一意な提案のみが返却される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue([
        { id: 'approach-A', name: '顧客セグメント別提案', score: 0.92 },
        { id: 'approach-B', name: 'ROI重視提案', score: 0.88 },
        { id: 'approach-A', name: '顧客セグメント別提案', score: 0.92 },
      ]),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const inputCondition = {
      customerId: 'CUST-001',
      industryType: 'manufacturing',
      companySize: 'large',
      dealAmount: 5000000,
      proposalStage: 'initial_contact',
    };

    const result = generateRecommendation(inputCondition, mockAIEngine);

    expect(result).resolves.toHaveLength(2);
    expect(result).resolves.toEqual([
      { id: 'approach-A', name: '顧客セグメント別提案', score: 0.92 },
      { id: 'approach-B', name: 'ROI重視提案', score: 0.88 },
    ]);
  });
});