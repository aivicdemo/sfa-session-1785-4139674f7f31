import { calculateProposalProcessDeviation } from '../../src/logic/it-1-br-3-3-2-1';

describe('提案内容と標準プロセスの乖離度算出', () => {
  // SCEN-2114
  test('成功パターンマッチ度の数値化結果が負数のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.5),
    };

    const dealCondition = {
      customerId: 'CUST-001',
      customerIndustry: 'IT',
      customerScale: 'large',
      proposalContent: 'Cloud migration solution',
      dealStage: 'negotiation',
    };

    expect(() => {
      calculateProposalProcessDeviation(dealCondition, mockAIRecommendationEngine);
    }).toThrow(/パターンマッチ度が無効な値です。スコアは0以上1以下である必要があります。受け取った値: -0.5/);
  });
});