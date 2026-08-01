import { calculateAndSortImprovementPriorities } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-670
  test('[normal] 改善優先度スコア算出機能 - 優先度スコアが高い順に並び替えられて返される', () => {
    const improvement_items = [
      {
        item_id: 'A',
        issue_name: '提案内容の標準化',
        impact_frequency: 5,
        severity_score: 65,
      },
      {
        item_id: 'B',
        issue_name: '顧客対応パターンの分析',
        impact_frequency: 8,
        severity_score: 92,
      },
      {
        item_id: 'C',
        issue_name: 'フォローアップ頻度の改善',
        impact_frequency: 3,
        severity_score: 48,
      },
      {
        item_id: 'D',
        issue_name: '提案資料の質向上',
        impact_frequency: 6,
        severity_score: 78,
      },
    ];

    const result = calculateAndSortImprovementPriorities(improvement_items);

    expect(result).toHaveLength(4);
    expect(result[0].item_id).toBe('B');
    expect(result[0].severity_score).toBe(92);
    expect(result[1].item_id).toBe('D');
    expect(result[1].severity_score).toBe(78);
    expect(result[2].item_id).toBe('A');
    expect(result[2].severity_score).toBe(65);
    expect(result[3].item_id).toBe('C');
    expect(result[3].severity_score).toBe(48);
  });
});