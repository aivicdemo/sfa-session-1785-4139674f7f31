import { evaluateRecommendationTrustworthiness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2442
  test('推奨精度スコア算出機能 - AIエージェント推論の信頼度が100のときスコア値100が返却される', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        trustworthinessScore: 100,
      }),
    };

    const dealPatternData = {
      customerId: 'CUST-001',
      dealAmount: 5000000,
      industryCategory: 'manufacturing',
      dealStage: 'proposal',
      customerCompanySize: 'large',
      proposalApproach: 'cost_reduction_focus',
    };

    const result = evaluateRecommendationTrustworthiness(
      dealPatternData,
      mockAIRecommendationEngine
    );

    return result.then((score) => {
      expect(score).toBe(100);
    });
  });
});