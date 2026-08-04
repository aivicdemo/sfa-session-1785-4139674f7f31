import { validateProposalApproachViability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1223: 商談IDが空文字列のとき、エラーを返す', () => {
    const dealId = '';
    const proposalContent = {
      targetCustomerId: 'CUST001',
      proposedApproach: 'サンプル提案内容',
      estimatedTimeline: '2024-06-01',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = validateProposalApproachViability(
      dealId,
      proposalContent,
      mockAIEngine
    );

    expect(result).toEqual({
      isValid: false,
      errorCode: 'INVALID_DEALID_EMPTY',
      errorMessage: '商談IDが指定されていません',
      httpStatusCode: 400,
    });

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});