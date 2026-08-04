import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1214
  test('提案妥当性確認判定機能 - リスク要因が空配列のときエラーを返す', () => {
    const input = {
      proposalId: 'PROP-001',
      customerId: 'CUST-001',
      proposalContent: {
        productName: 'Enterprise Solution',
        estimatedCost: 5000000,
        implementationPeriod: 6,
      },
      customerConstraints: {
        budgetLimit: 10000000,
        scheduleConstraint: 12,
        applicableCategories: ['Enterprise', 'Solutions'],
      },
      riskFactors: [],
      successPatternMatches: [
        {
          patternId: 'PAT-001',
          matchScore: 0.85,
          patternName: '大規模予算案件の成功パターン',
        },
      ],
    };

    expect(() => evaluatePatternRelevance(input)).toThrow(/リスク要因/);
  });
});