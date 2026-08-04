import { calculateImprovementPriorityRank } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善優先度ランク算出機能', () => {
  // SCEN-487
  test('改善対象項目の影響度が null のとき、エラーが発生する', () => {
    const improvementItems = [
      {
        itemId: 'item-001',
        itemName: 'データ品質スコア',
        impactScore: null,
        currentValue: 75,
        targetValue: 95,
      },
      {
        itemId: 'item-002',
        itemName: '営業プロセス標準化達成度',
        impactScore: 8.5,
        currentValue: 60,
        targetValue: 90,
      },
    ];

    expect(() => calculateImprovementPriorityRank(improvementItems)).toThrow(
      /INVALID_IMPACT_SCORE/
    );
  });
});