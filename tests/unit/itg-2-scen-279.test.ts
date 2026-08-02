import { calculateProcessComplianceDeviationScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジンの構築', () => {
  // SCEN-279
  test('標準プロセス遵守度スコア計算 - 交渉ステップが標準プロセスと一致するとき、該当ステップの乖離度が0になる', () => {
    const standardProcessSteps = [
      { step_id: 1, step_name: '初回接触', sequence: 1 },
      { step_id: 2, step_name: '提案提示', sequence: 2 },
      { step_id: 3, step_name: '交渉', sequence: 3 },
      { step_id: 4, step_name: '成約', sequence: 4 },
    ];

    const negotiationStepData = {
      step_name: '提案提示',
      execution_date: new Date('2024-01-15T10:00:00Z'),
    };

    const deviationScore = calculateProcessComplianceDeviationScore(
      negotiationStepData,
      standardProcessSteps
    );

    expect(deviationScore).toBe(0);
  });
});