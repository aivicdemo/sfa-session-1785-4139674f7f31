import { checkImprovementItemsConsistency } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム', () => {
  // SCEN-514
  test('改善対象項目の件数と改善優先度ランク情報の件数が一致していないとき、エラーをスロー', () => {
    const improvementItems = [
      { id: 'item_1', name: '顧客情報の品質向上' },
      { id: 'item_2', name: 'データ入力形式の統一' },
      { id: 'item_3', name: '営業提案の精度改善' },
    ];

    const priorityRankInfos = [
      { rankId: 'rank_1', rank: 'HIGH', itemId: 'item_1' },
      { rankId: 'rank_2', rank: 'MEDIUM', itemId: 'item_2' },
      { rankId: 'rank_3', rank: 'LOW', itemId: 'item_3' },
      { rankId: 'rank_4', rank: 'HIGH', itemId: 'item_4' },
      { rankId: 'rank_5', rank: 'MEDIUM', itemId: 'item_5' },
    ];

    expect(() =>
      checkImprovementItemsConsistency(improvementItems, priorityRankInfos)
    ).toThrow(/件数が一致していません/);
  });
});