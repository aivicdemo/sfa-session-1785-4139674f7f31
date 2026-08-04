import { calculateRecommendationScore } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨妥当性スコア算出機能', () => {
  // SCEN-1721
  test('提案内容IDが欠落しているとき推奨スコア算出が失敗する', () => {
    const stub_evaluatePatternRelevance = jest.fn();
    const mock_engine = {
      evaluatePatternRelevance: stub_evaluatePatternRelevance,
    };

    const input_params = {
      proposalContentId: null,
      customerId: 'CUST_001',
      dealConditionId: 'DEAL_001',
      successPatternId: 'PATTERN_001',
    };

    expect(() => {
      calculateRecommendationScore(input_params, mock_engine);
    }).toThrow(/提案内容ID/);

    expect(stub_evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});