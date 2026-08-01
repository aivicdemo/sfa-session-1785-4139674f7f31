import { judgeProposalApproach } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-270
  test('成功パターンマトリクス参照による提案アプローチ判定機能 - 成功パターンの導入期間が現在の顧客の購買タイミングより前の場合、適用不可と判定される', () => {
    const successPatternMatrix = {
      patternId: 'pattern-001',
      adoptionStartDate: new Date('2023-04-01'),
      adoptionEndDate: new Date('2023-09-30'),
      customerSegment: 'segment-A',
      proposalApproach: 'approach-standard',
      successRate: 0.75,
    };

    const customerContext = {
      customerId: 'customer-001',
      purchasingTiming: new Date('2023-03-15'),
      segment: 'segment-A',
      needsCategory: 'category-001',
    };

    const result = judgeProposalApproach(successPatternMatrix, customerContext);

    expect(result.judgement).toBe('inapplicable');
    expect(result.reason).toContain('導入期間');
    expect(result.reason).toContain('2023-04-01');
    expect(result.reason).toContain('2023-03-15');
  });
});