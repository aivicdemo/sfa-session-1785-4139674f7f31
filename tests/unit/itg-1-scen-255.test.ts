import { evaluateProposalApproachApplicability } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-255: [normal] 成功パターンマトリクス参照による提案アプローチ判定機能 - 現在の顧客の業種が成功パターンと部分的に一致する場合、適用可能性が適切に判定される
  test('should judge proposal approach applicability with partial industry match', () => {
    const successPatternMatrix = [
      {
        industry: '製造業',
        successRate: 0.75,
        caseCount: 45,
      },
      {
        industry: '卸売業',
        successRate: 0.68,
        caseCount: 32,
      },
      {
        industry: '小売業',
        successRate: 0.62,
        caseCount: 28,
      },
    ];

    const customerData = {
      customerId: 'CUST-001',
      industry: '製造業（部品加工）',
      businessType: '部品製造',
    };

    const result = evaluateProposalApproachApplicability(
      customerData,
      successPatternMatrix
    );

    expect(result.applicabilityScore).toBeGreaterThanOrEqual(0.6);
    expect(result.applicabilityScore).toBeLessThanOrEqual(0.8);
    expect(result.judgmentStatus).toBe('条件付き適用可');
    expect(result.matchedSuccessPattern).toBe('製造業');
  });
});