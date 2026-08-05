import { analyzeTeamQualityStatistics } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質統計分析機能', () => {
  // SCEN-894
  test('成約率データとフォローアップ成功率データの営業担当者マッピングが不一致のとき、エラーになる', () => {
    const conversion_rate_data = [
      { sales_rep_id: 'rep_a', conversion_rate: 0.45 },
      { sales_rep_id: 'rep_b', conversion_rate: 0.52 },
      { sales_rep_id: 'rep_c', conversion_rate: 0.38 },
    ];

    const followup_success_rate_data = [
      { sales_rep_id: 'rep_a', followup_success_rate: 0.68 },
      { sales_rep_id: 'rep_d', followup_success_rate: 0.71 },
    ];

    expect(() =>
      analyzeTeamQualityStatistics(conversion_rate_data, followup_success_rate_data)
    ).toThrow(/営業担当者マッピング/);
  });
});