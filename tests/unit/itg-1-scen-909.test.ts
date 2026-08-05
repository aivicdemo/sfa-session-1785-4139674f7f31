import { calculateDeviation } from '../../src/logic/it-1-br-2-1-1';

describe('営業担当者の行動パターンと成約実績の自動分析・レポート機能', () => {
  // SCEN-909
  test('チーム営業品質月次分析機能 - 過去3ヶ月の成約率がチーム平均より許容範囲直上のときの乖離度が正しく算出される', () => {
    // 準備: テスト対象チームの過去3ヶ月の成約率データ
    const month_1_rate = 45.0;
    const month_2_rate = 46.5;
    const month_3_rate = 47.2;

    // チーム平均成約率
    const team_avg_rate = 47.5;

    // 許容範囲
    const tolerance_range = 0.5;
    const lower_limit = team_avg_rate - tolerance_range; // 47.0%
    const upper_limit = team_avg_rate + tolerance_range; // 48.0%

    // 対象チームの過去3ヶ月平均成約率を計算
    const target_team_avg_rate = (month_1_rate + month_2_rate + month_3_rate) / 3;
    // 期待値: (45.0 + 46.5 + 47.2) / 3 = 46.233...%

    // 乖離度計算関数を呼び出す
    const deviation = calculateDeviation(target_team_avg_rate, team_avg_rate);

    // 期待結果: 乖離度が-1.267%で返される
    // 計算: 46.233... - 47.5 = -1.266...%
    const expected_deviation = target_team_avg_rate - team_avg_rate;

    // 乖離度が許容範囲直上（下限を超過）を示している
    expect(deviation).toBeCloseTo(expected_deviation, 2);
    expect(deviation).toBeLessThan(lower_limit - team_avg_rate); // -0.5より小さい（許容範囲外）
    expect(deviation).toBeGreaterThan(-2); // 合理的な範囲内
  });
});