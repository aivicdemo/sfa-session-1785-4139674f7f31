import { calculateProcessComplianceDeviation } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン - 標準プロセス遵守度スコア計算', () => {
  test('SCEN-282: 成約ステップが標準プロセスと一致するとき、該当ステップの乖離度が0になる', () => {
    // Setup
    const standardProcessSteps = ['初期接触', '要件確認', '提案', '成約'];
    const actualProcessSteps = ['初期接触', '要件確認', '提案', '成約'];

    // Execute
    const deviationResult = calculateProcessComplianceDeviation({
      standardSteps: standardProcessSteps,
      actualSteps: actualProcessSteps,
    });

    // Assert - 成約ステップ(4番目、index 3)の乖離度が0であることを検証
    expect(deviationResult.stepDeviations[3]).toBe(0);
  });
});