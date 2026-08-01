import { describe, test, expect } from '@jest/globals';
import { calculateBehaviorPatternAnalysisReport } from '../../src/logic/it-1-br-target4-1-1-1';

describe('営業担当者ごとの行動パターン分析レポート生成機能', () => {
  // SCEN-649
  test('チーム平均との乖離度の計算結果が端数の場合、指定の丸め方法で処理される', () => {
    const salesPersonAContractRate = 75.33333;
    const teamAverageContractRate = 70.00000;
    const roundingMethod = 'round_to_2_decimal_places';

    const result = calculateBehaviorPatternAnalysisReport({
      salesPersonContractRate: salesPersonAContractRate,
      teamAverageContractRate: teamAverageContractRate,
      roundingMethod: roundingMethod,
    });

    expect(result.deviationRate).toBe(5.33);
  });
});