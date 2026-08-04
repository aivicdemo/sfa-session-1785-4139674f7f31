import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推奨スコア算出', () => {
  test('SCEN-1660: 提案金額が負の値のとき、エラーが発生する', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn(),
    };

    const negativeProposalAmount = -50000;
    const patternData = {
      customerId: 'CUST-001',
      industryType: 'technology',
      companySize: 'large',
      proposalAmount: negativeProposalAmount,
      targetTimeline: 'Q1_2024',
    };

    expect(() => {
      evaluatePatternRelevance(patternData, mockAIRecommendationEngine);
    }).toThrow(/提案金額|proposal amount/);
  });
});