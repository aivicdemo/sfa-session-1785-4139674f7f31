import { validateProposalAppropriatenessWithReasoningVisibility } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1216
  test('提案妥当性確認判定機能 - 顧客ニーズが空文字列のとき、エラーを返す', () => {
    const customerNeeds = '';
    const proposalContent = '新規システム導入による業務効率化';
    const customerConstraints = {
      budgetLimit: 5000000,
      timelineConstraint: '2024年Q4までに実装必須',
      purchasableCategoryIds: ['CAT001', 'CAT002'],
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = validateProposalAppropriatenessWithReasoningVisibility(
      customerNeeds,
      proposalContent,
      customerConstraints,
      mockAIEngine
    );

    expect(result).toHaveProperty('isError');
    expect(result.isError).toBe(true);
    expect(result).toHaveProperty('errorCode');
    expect(result.errorCode).toBe('INVALID_INPUT');
    expect(result).toHaveProperty('errorMessage');
    expect(result.errorMessage).toBe('顧客ニーズは空文字列では指定できません');
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});