import { describe, it, expect, beforeEach } from '@jest/globals';
import { calculateTeamQualityDeviation } from '../../src/logic/it-1-br-2-1-1';

describe('チーム営業品質月次分析機能 - 成約率乖離度算出', () => {
  // SCEN-908
  it('過去3ヶ月の成約率がチーム平均より許容範囲直下のときの乖離度が正しく算出される', () => {
    const past_three_months_rates = [45, 46, 47];
    const team_average_rate = 50;
    const tolerance_lower = 47;
    const tolerance_upper = 53;

    const result = calculateTeamQualityDeviation({
      past_three_months_rates,
      team_average_rate,
      tolerance_lower,
      tolerance_upper,
    });

    const expected_average_rate = (45 + 46 + 47) / 3;
    expect(expected_average_rate).toBe(46);

    const expected_deviation = team_average_rate - expected_average_rate;
    expect(expected_deviation).toBe(4);

    expect(result.average_rate).toBe(46);
    expect(result.deviation_points).toBe(-4);
    expect(result.is_out_of_tolerance).toBe(true);
  });
});