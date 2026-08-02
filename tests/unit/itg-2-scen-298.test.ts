import { calculateProcessComplianceScores } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 標準プロセス遵守度スコア計算', () => {
  test('SCEN-298: 複数営業担当者のスコア降順ソートで改善指導優先順位が正しく付与される', () => {
    // 3名の営業担当者データを準備
    const salesRepresentatives = [
      {
        sales_rep_id: 'rep_001',
        sales_rep_name: 'A',
        compliance_score: 75,
      },
      {
        sales_rep_id: 'rep_002',
        sales_rep_name: 'B',
        compliance_score: 92,
      },
      {
        sales_rep_id: 'rep_003',
        sales_rep_name: 'C',
        compliance_score: 58,
      },
    ];

    // スコア計算エンジンを実行
    const result = calculateProcessComplianceScores(salesRepresentatives);

    // ソート結果の確認：降順（高スコア順）
    expect(result).toEqual([
      {
        sales_rep_id: 'rep_002',
        sales_rep_name: 'B',
        compliance_score: 92,
        improvement_priority: 4,
      },
      {
        sales_rep_id: 'rep_001',
        sales_rep_name: 'A',
        compliance_score: 75,
        improvement_priority: 2,
      },
      {
        sales_rep_id: 'rep_003',
        sales_rep_name: 'C',
        compliance_score: 58,
        improvement_priority: 1,
      },
    ]);

    // 並び順を個別確認
    expect(result[0].sales_rep_name).toBe('B');
    expect(result[1].sales_rep_name).toBe('A');
    expect(result[2].sales_rep_name).toBe('C');

    // 改善指導優先順位を個別確認：低スコアほど低い優先順位番号（優先度が高い）
    expect(result[0].improvement_priority).toBe(4);
    expect(result[1].improvement_priority).toBe(2);
    expect(result[2].improvement_priority).toBe(1);
  });
});