import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案妥当性確認判定', () => {
  test('SCEN-1205: 提案内容が null のとき、INVALID_PROPOSAL_CONTENT エラーをスローする', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const nullProposalContent = null;
    const customerConstraints = {
      businessGoal: '売上 10% 増加',
      budgetLimit: 5000000,
      scheduleConstraint: '2024-12-31',
    };

    expect(() => {
      evaluateProposalValidity(
        nullProposalContent,
        customerConstraints,
        mockAIEngine
      );
    }).toThrow(/INVALID_PROPOSAL_CONTENT/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});