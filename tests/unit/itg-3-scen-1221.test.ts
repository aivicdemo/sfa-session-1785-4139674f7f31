import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 提案妥当性確認判定', () => {
  test('SCEN-1221: リスク要因スコアが許容上限を超えるときエラーを返す', () => {
    const mockAIRecommendationEngine = {
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        riskScore: 0.95,
      }),
    };

    const testInput = {
      customerId: 'CUST-001',
      dealAmount: 5000000,
      dealConditions: {
        industry: 'manufacturing',
        contractTerm: 24,
      },
    };

    const riskScoreLimit = 0.90;

    expect(() =>
      evaluateProposalValidity(
        testInput,
        mockAIRecommendationEngine,
        riskScoreLimit,
      ),
    ).toThrow(/リスク要因スコア/);
  });
});