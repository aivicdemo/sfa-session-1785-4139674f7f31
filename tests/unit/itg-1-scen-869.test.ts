import { describe, test, expect } from '@jest/globals';
import { calculateDeviationFromTeamAverage } from '../../src/logic/it-1-br-2-1-1';

describe('チーム平均との乖離度判定機能', () => {
  // SCEN-869
  test('営業担当者のフォローアップ成功率とチーム平均との乖離度が正常に算出される', () => {
    const individual_success_rate = 65;
    const team_average_success_rate = 55;

    const result = calculateDeviationFromTeamAverage({
      individual_success_rate,
      team_average_success_rate,
    });

    expect(result.deviation_points).toBe(10);
    expect(result.is_above_average).toBe(true);
    expect(result.individual_success_rate).toBe(65);
    expect(result.team_average_success_rate).toBe(55);
  });
});