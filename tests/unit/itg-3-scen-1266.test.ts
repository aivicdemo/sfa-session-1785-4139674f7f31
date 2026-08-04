import { evaluateProposalValidity } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - 提案妥当性判定機能', () => {
  // SCEN-1266
  test('両方とも要件を満たすがリスク要因が許容範囲超過の場合に却下判定が出力される', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposals: [
          {
            id: 'proposal_a',
            customerRequirementSatisfaction: 95,
            budgetAlignment: 90,
            riskFactorScore: 78
          },
          {
            id: 'proposal_b',
            customerRequirementSatisfaction: 92,
            budgetAlignment: 88,
            riskFactorScore: 81
          }
        ]
      }),
      evaluatePatternRelevance: jest
        .fn()
        .mockResolvedValueOnce({ relevanceScore: 0.85 })
        .mockResolvedValueOnce({ relevanceScore: 0.82 })
    };

    const riskToleranceThreshold = 75;
    const customerContext = {
      customerId: 'cust_001',
      industry: 'manufacturing',
      budget: 5000000
    };
    const proposalInput = {
      customerRequirementSatisfaction: 95,
      budgetAlignment: 90,
      riskFactorScore: 78
    };
    const proposalInputB = {
      customerRequirementSatisfaction: 92,
      budgetAlignment: 88,
      riskFactorScore: 81
    };

    const resultA = evaluateProposalValidity(
      proposalInput,
      riskToleranceThreshold,
      mockAIEngine
    );

    const resultB = evaluateProposalValidity(
      proposalInputB,
      riskToleranceThreshold,
      mockAIEngine
    );

    expect(resultA.judgmentStatus).toBe('却下（リスク超過）');
    expect(resultA.rejectionReasonDetail).toMatch(/リスク要因スコアが許容範囲/);
    expect(resultA.rejectionReasonDetail).toMatch(/75%以下/);

    expect(resultB.judgmentStatus).toBe('却下（リスク超過）');
    expect(resultB.rejectionReasonDetail).toMatch(/リスク要因スコアが許容範囲/);
    expect(resultB.rejectionReasonDetail).toMatch(/75%以下/);
  });
});