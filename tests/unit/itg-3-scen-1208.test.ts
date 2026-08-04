import { evaluateProposalViability } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1208
  test('提案妥当性確認判定機能 - リスク要因が null のとき、エラーを返す', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockReturnValue({
        isSuccess: false,
        errorCode: 'INVALID_INPUT_RISK_FACTOR_NULL',
        errorMessage: 'リスク要因が指定されていません。提案妥当性の判定を実行するにはリスク要因の情報が必須です',
      }),
    };

    const proposalInput = {
      proposalId: 'PROP-2024-001',
      customerId: 'CUST-5001',
      proposalContent: '新規営業支援ツールの導入',
      viabilityScore: 0,
      customerConstraints: {
        budgetLimit: 5000000,
        scheduleConstraint: '2024-Q2',
        purchaseCategoryConstraint: ['IT', 'SaaS'],
      },
      riskFactors: null,
    };

    const result = evaluateProposalViability(proposalInput, mockAIRecommendationEngine);

    expect(result.isSuccess).toBe(false);
    expect(result.errorCode).toBe('INVALID_INPUT_RISK_FACTOR_NULL');
    expect(result.errorMessage).toBe('リスク要因が指定されていません。提案妥当性の判定を実行するにはリスク要因の情報が必須です');
    expect(() => {
      throw new Error(result.errorMessage);
    }).toThrow(/リスク要因/);
  });
});