import { calculateComplianceScoreForReportGeneration } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-1052
  test('理解度スコア計算時に小数第3位で端数が発生する場合に正しく丸められる', () => {
    // テストケース: 複数の行動スコアの平均値が小数第3位で端数が発生するデータセット
    const behavior_scores = [66.0, 67.0, 66.666666666];
    const sales_rep_id = 'SR-001';
    const reporting_period = '2024-01';

    const result = calculateComplianceScoreForReportGeneration({
      sales_rep_id,
      reporting_period,
      behavior_scores,
    });

    // 入力の3つの行動スコアの平均値: (66.0 + 67.0 + 66.666666666) / 3 = 66.5555...
    // 小数第2位で四捨五入: 66.56
    expect(result.compliance_score).toBe(66.56);
    expect(result.sales_rep_id).toBe('SR-001');
    expect(result.reporting_period).toBe('2024-01');
  });
});