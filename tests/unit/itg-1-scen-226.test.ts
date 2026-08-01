import { executeHealthCheckJudgment } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-226
  test('チェック基準が定義されていないときエラーが発生する', () => {
    const inputWithoutCriteria = {
      checkCriteria: null,
      systemMetrics: {
        uptime: 99.5,
        dataQualityScore: 0.92,
        inferenceAccuracy: 0.88,
      },
      checkTimestamp: new Date('2024-01-15T11:00:00Z'),
    };

    expect(() =>
      executeHealthCheckJudgment(inputWithoutCriteria)
    ).toThrow(/チェック基準/);
  });
});