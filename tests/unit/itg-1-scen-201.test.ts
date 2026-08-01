import { restructureSalesRepImprovementTargetList } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-201: [normal] 営業担当者行動パターン分析・改善指導対象判定機能 - 改善指導対象者リストの順序が逆順である場合、正しい順序に再整列される
  test('should reorder improvement target list to ascending order by sales achievement rate when input is in reverse order', () => {
    const improveTargetListReversed = [
      {
        sales_rep_id: 'REP003',
        sales_rep_name: '営業太郎',
        sales_achievement_rate: 95.5,
      },
      {
        sales_rep_id: 'REP002',
        sales_rep_name: '営業花子',
        sales_achievement_rate: 72.3,
      },
      {
        sales_rep_id: 'REP001',
        sales_rep_name: '営業次郎',
        sales_achievement_rate: 58.1,
      },
    ];

    const result = restructureSalesRepImprovementTargetList(improveTargetListReversed);

    expect(result).toEqual([
      {
        sales_rep_id: 'REP001',
        sales_rep_name: '営業次郎',
        sales_achievement_rate: 58.1,
      },
      {
        sales_rep_id: 'REP002',
        sales_rep_name: '営業花子',
        sales_achievement_rate: 72.3,
      },
      {
        sales_rep_id: 'REP003',
        sales_rep_name: '営業太郎',
        sales_achievement_rate: 95.5,
      },
    ]);

    expect(result[0].sales_achievement_rate).toBe(58.1);
    expect(result[2].sales_achievement_rate).toBe(95.5);
  });
});