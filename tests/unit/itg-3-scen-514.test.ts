import { checkImprovementItemsConsistency } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 改善対象項目と改善優先度ランクの整合性検証', () => {
  test('SCEN-514: 改善対象項目と改善優先度ランク情報の件数が一致していないときはエラーをスロー', () => {
    const improvementItems = [
      { id: 'item-1', name: '提案資料の形式統一' },
      { id: 'item-2', name: 'ニーズ把握の深掘り' },
      { id: 'item-3', name: 'フォローアップタイミング調整' },
    ];

    const priorityRanks = [
      { id: 'rank-1', level: 'HIGH', itemId: 'item-1' },
      { id: 'rank-2', level: 'MEDIUM', itemId: 'item-2' },
      { id: 'rank-3', level: 'MEDIUM', itemId: 'item-3' },
      { id: 'rank-4', level: 'LOW', itemId: 'item-4' },
      { id: 'rank-5', level: 'LOW', itemId: 'item-5' },
    ];

    expect(() =>
      checkImprovementItemsConsistency(improvementItems, priorityRanks)
    ).toThrow(/改善対象項目の件数.*改善優先度ランク情報の件数.*一致/);
  });
});