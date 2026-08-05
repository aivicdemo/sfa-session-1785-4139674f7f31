import { describe, test, expect } from '@jest/globals';
import { calculateDeviationFromTeamAverage } from '../../src/logic/it-1-br-2-1-1';

describe('IT-1-BR-2-1-1: チーム平均との乖離度判定機能', () => {
  test('SCEN-867: 個別営業担当者の成約率とチーム平均との乖離度が正常に算出される', () => {
    const team_average_conversion_rate = 50;
    const individual_conversion_rate = 65;

    const result = calculateDeviationFromTeamAverage({
      team_average_conversion_rate,
      individual_conversion_rate,
    });

    expect(result.deviation_points).toBe(15);
    expect(result.classification_status).toBe('上回る');
  });
});