import { describe, test, expect, beforeEach } from '@jest/globals';
import { calculateProcessComplianceDeviation } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書との乖離分析と成約実績の相関分析 - 乖離度の丸め処理', () => {
  // SCEN-1212
  test('乖離度計算で小数点第3位以下の端数が正しく丸められること', () => {
    // ケース1: 標準ステップ10個中9個実施 → 乖離度 = (10-9)/10 × 100 = 10.0%
    const deviation_case1 = calculateProcessComplianceDeviation({
      total_standard_steps: 10,
      completed_steps: 9,
    });
    expect(deviation_case1).toBe(10.0);

    // ケース2: 標準ステップ10個中8個実施 → 乖離度 = (10-8)/10 × 100 = 20.0%
    const deviation_case2 = calculateProcessComplianceDeviation({
      total_standard_steps: 10,
      completed_steps: 8,
    });
    expect(deviation_case2).toBe(20.0);

    // ケース3: 標準ステップ10個中7個実施 → 乖離度 = (10-7)/10 × 100 = 30.0%
    const deviation_case3 = calculateProcessComplianceDeviation({
      total_standard_steps: 10,
      completed_steps: 7,
    });
    expect(deviation_case3).toBe(30.0);

    // ケース4: 標準ステップ100個中33個実施 → 乖離度 = (100-33)/100 × 100 = 67.0%
    const deviation_case4 = calculateProcessComplianceDeviation({
      total_standard_steps: 100,
      completed_steps: 33,
    });
    expect(deviation_case4).toBe(67.0);

    // ケース5: 標準ステップ100個中33個実施（別計算パス・遵守率）
    // 遵守率 = 33/100 × 100 = 33.0%
    // 乖離度 = 100 - 33 = 67.0%
    const deviation_case5 = calculateProcessComplianceDeviation({
      total_standard_steps: 100,
      completed_steps: 33,
    });
    expect(deviation_case5).toBe(67.0);

    // ケース6: 標準ステップ1000個中333個実施 → 乖離度 = (1000-333)/1000 × 100 = 66.7%
    const deviation_case6 = calculateProcessComplianceDeviation({
      total_standard_steps: 1000,
      completed_steps: 333,
    });
    expect(deviation_case6).toBe(66.7);

    // ケース7: 標準ステップ1000個中334個実施 → 乖離度 = (1000-334)/1000 × 100 = 66.6%
    const deviation_case7 = calculateProcessComplianceDeviation({
      total_standard_steps: 1000,
      completed_steps: 334,
    });
    expect(deviation_case7).toBe(66.6);

    // ケース8: 標準ステップ1000個中3333個実施（無効値）→ エラー処理
    expect(() =>
      calculateProcessComplianceDeviation({
        total_standard_steps: 1000,
        completed_steps: 3333,
      }),
    ).toThrow(/完了ステップ数/);
  });
});