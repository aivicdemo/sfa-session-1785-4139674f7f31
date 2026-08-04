import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク算出機能', () => {
  test('SCEN-487: 改善対象項目の影響度が null のとき、エラーが発生する', () => {
    const improvementItemsWithNullImpact = [
      {
        itemId: 'item-001',
        itemName: 'データ入力品質改善',
        impactScore: null,
        urgencyLevel: 'high',
        estimatedEffort: 5,
      },
      {
        itemId: 'item-002',
        itemName: 'プロセス標準化',
        impactScore: 85,
        urgencyLevel: 'medium',
        estimatedEffort: 8,
      },
    ];

    expect(() =>
      calculateImprovementPriorityRank(improvementItemsWithNullImpact)
    ).toThrow(/INVALID_IMPACT_SCORE/);

    try {
      calculateImprovementPriorityRank(improvementItemsWithNullImpact);
    } catch (error: any) {
      expect(error.message).toContain('改善対象項目の影響度が不正です');
      expect(error.message).toContain('各項目の影響度は0以上の数値である必要があります');
    }
  });
});