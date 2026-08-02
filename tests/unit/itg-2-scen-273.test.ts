import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-273
  test('標準プロセス遵守度スコア計算 - 初回接触ステップが標準プロセスと一致するとき、該当ステップの乖離度が0になる', () => {
    const standardProcessSteps = [
      { stepName: '初回接触', expectedAction: '顧客情報確認', sequence: 1 },
      { stepName: '提案', expectedAction: '提案実施', sequence: 2 },
      { stepName: '交渉', expectedAction: '条件調整', sequence: 3 },
      { stepName: '成約', expectedAction: '契約締結', sequence: 4 }
    ];

    const dealProcessHistory = [
      { stepName: '初回接触', actualAction: '顧客情報確認', executedAt: '2024-01-15T10:00:00Z' },
      { stepName: '提案', actualAction: '提案実施_修正版', executedAt: '2024-01-16T14:30:00Z' },
      { stepName: '交渉', actualAction: '条件調整', executedAt: '2024-01-17T11:20:00Z' },
      { stepName: '成約', actualAction: '契約締結', executedAt: '2024-01-18T15:45:00Z' }
    ];

    const result = calculateProcessComplianceScore(standardProcessSteps, dealProcessHistory);

    expect(result).toEqual({
      overallComplianceScore: 75,
      stepDeviations: [
        { stepName: '初回接触', deviationDegree: 0 },
        { stepName: '提案', deviationDegree: 25 },
        { stepName: '交渉', deviationDegree: 0 },
        { stepName: '成約', deviationDegree: 0 }
      ]
    });

    expect(result.stepDeviations[0].deviationDegree).toBe(0);
    expect(result.overallComplianceScore).toBe(75);
  });
});