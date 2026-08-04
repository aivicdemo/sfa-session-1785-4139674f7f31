import { evaluateRecommendationReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1571
  test('推奨根拠のスコアが負の値のとき、エラーが発生する', () => {
    const mockAIEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue(-0.5),
    };

    const dealCondition = {
      customerId: 'cust-001',
      productCategory: 'cloud-solution',
      dealValue: 500000,
      industry: 'IT',
      companySize: 'large',
    };

    const proposalContent = {
      proposalId: 'prop-001',
      approach: 'multi-phase-implementation',
      timeline: 12,
    };

    expect(() => {
      evaluateRecommendationReasoning(
        dealCondition,
        proposalContent,
        mockAIEngine
      );
    }).toThrow(/推奨根拠スコア/);
  });
});