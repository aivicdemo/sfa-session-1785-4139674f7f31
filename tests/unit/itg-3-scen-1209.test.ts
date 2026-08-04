import { validateProposalAppropriateness } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1209: 営業管理職権限がないユーザーで実行された場合、アクセス拒否エラーを返す', () => {
    const userWithoutManagerRole = {
      userId: 'user-001',
      role: 'general_sales',
      permissions: ['read_proposal', 'create_proposal'],
    };

    const proposalData = {
      proposalId: 'prop-001',
      customerId: 'cust-001',
      content: 'テスト提案内容',
      createdAt: '2024-01-15T11:00:00Z',
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const executeAction = () => {
      return validateProposalAppropriateness(
        userWithoutManagerRole,
        proposalData,
        mockAIEngine
      );
    };

    const result = executeAction();

    expect(result.statusCode).toBe(403);
    expect(result.errorCode).toBe('ACCESS_DENIED');
    expect(result.errorMessage).toBe('営業管理職権限が必要です');
    expect(result.details).toBe('このアクション実行にはマネージャー以上の権限が必要です');
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
  });
});