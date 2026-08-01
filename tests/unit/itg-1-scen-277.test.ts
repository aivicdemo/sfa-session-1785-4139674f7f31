import { judgeProposalApproachBySuccessPattern } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-277
  test('[normal] 成功パターンマトリクス参照による提案アプローチ判定機能 - 適用可能なアプローチが複数特定された場合、最上位のアプローチのみについて判断根拠が提示される', () => {
    const successPatternMatrix = [
      {
        approachId: 'APPROACH_A',
        priority: 1,
        judgmentReason: '顧客規模が大企業',
        customerSize: '大企業',
        competitorStatus: null,
        budgetThreshold: null,
      },
      {
        approachId: 'APPROACH_B',
        priority: 2,
        judgmentReason: '競合他社なし',
        customerSize: null,
        competitorStatus: 'なし',
        budgetThreshold: null,
      },
      {
        approachId: 'APPROACH_C',
        priority: 3,
        judgmentReason: '予算上限額が高い',
        customerSize: null,
        competitorStatus: null,
        budgetThreshold: 10000000,
      },
    ];

    const proposalCondition = {
      customerSize: '大企業',
      competitorStatus: 'なし',
      budgetThreshold: 10000000,
    };

    const result = judgeProposalApproachBySuccessPattern(
      successPatternMatrix,
      proposalCondition
    );

    expect(result.applicableApproaches).toEqual(['APPROACH_A', 'APPROACH_B', 'APPROACH_C']);
    expect(result.topPriorityApproach).toBe('APPROACH_A');
    expect(result.displayedJudgmentReason).toBe('顧客規模が大企業');
    expect(result.displayedJudgmentReasonCount).toBe(1);
    expect(result.hiddenReasons).toEqual(['競合他社なし', '予算上限額が高い']);
  });
});