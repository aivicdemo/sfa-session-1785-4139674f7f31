import { evaluatePatternRelevance } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-1383
  test('実装可能性スコアが計算できないとき数値表示がエラーになる', () => {
    const proposalInput = {
      customerId: 'CUST-001',
      proposedApproachId: 'APPROACH-100',
      customerConstraints: {
        budgetLimit: 5000000,
        scheduleConstraint: '2024-Q2',
        categoryRestriction: ['ソフトウェア', 'コンサルティング'],
      },
      historicalSuccessPatterns: [
        {
          patternId: 'PATTERN-A',
          customerIndustry: 'IT',
          customerSize: 'large',
          successRate: 0.85,
          matchingFactors: ['予算規模一致', '業種一致'],
        },
      ],
    };

    expect(() => {
      const result = evaluatePatternRelevance(proposalInput);
      if (result === null) {
        throw new TypeError('実装可能性スコアの計算に失敗しました');
      }
      const numericScore = result.compatibilityScore;
      if (numericScore === undefined || numericScore === null) {
        throw new Error('実装可能性スコア');
      }
    }).toThrow(/実装可能性スコア/);
  });
});