import { describe, test, expect, beforeEach } from '@jest/globals';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-463
  test('複数のAIエージェント推論ログから精度監視対象を抽出し、各推論の精度状態が正常に判定される', () => {
    // Import the function under test
    const { monitorAiInferenceAccuracy } = require('../../src/logic/it-1-br-2-1-1-1');

    // Setup: AIエージェント推論ログデータベース構築
    const inferenceLogsData = [
      {
        inferenceId: 'LOG001',
        inferenceType: '営業予測',
        executionDateTime: new Date('2024-01-10T09:30:00Z'),
        predictedValue: 'deal_won',
        actualValue: 'deal_won',
        totalRecords: 50,
        matchedRecords: 46,
      },
      {
        inferenceId: 'LOG002',
        inferenceType: '営業予測',
        executionDateTime: new Date('2024-01-12T14:15:00Z'),
        predictedValue: 'deal_pipeline',
        actualValue: 'deal_won',
        totalRecords: 40,
        matchedRecords: 30,
      },
      {
        inferenceId: 'LOG003',
        inferenceType: '顧客分析',
        executionDateTime: new Date('2024-01-05T08:00:00Z'),
        predictedValue: 'high_value',
        actualValue: 'high_value',
        totalRecords: 30,
        matchedRecords: 28,
      },
    ];

    // Define extraction criteria: 営業予測 type and within past 7 days
    const monitoringCriteria = {
      inferenceTypeFilter: '営業予測',
      daysWithinRange: 7,
      referenceDateTime: new Date('2024-01-17T23:59:59Z'),
    };

    // Execute the monitoring process
    const result = monitorAiInferenceAccuracy(inferenceLogsData, monitoringCriteria);

    // Verify: 抽出対象の3件のうち、条件に合致した2件（LOG001, LOG002）が正常に抽出される
    expect(result.extractedLogs).toHaveLength(2);
    expect(result.extractedLogs.map((log: any) => log.inferenceId)).toEqual(['LOG001', 'LOG002']);

    // Verify: LOG001は正解率92%で「正常」状態
    const log001Result = result.accuracyJudgments.find((j: any) => j.inferenceId === 'LOG001');
    expect(log001Result).toBeDefined();
    expect(log001Result.accuracyPercentage).toBe(92);
    expect(log001Result.statusJudgment).toBe('正常');

    // Verify: LOG002は正解率75%で「注意」状態
    const log002Result = result.accuracyJudgments.find((j: any) => j.inferenceId === 'LOG002');
    expect(log002Result).toBeDefined();
    expect(log002Result.accuracyPercentage).toBe(75);
    expect(log002Result.statusJudgment).toBe('注意');

    // Verify: 対象外のLOG003は処理対象から除外される
    const log003Result = result.accuracyJudgments.find((j: any) => j.inferenceId === 'LOG003');
    expect(log003Result).toBeUndefined();

    // Verify: 判定結果がシステムのアラート機能へ正常に連携される
    expect(result.alertNotificationStatus).toBe('連携完了');
    expect(result.alertNotificationTargets).toContain('LOG002');
    expect(result.alertNotificationTimestamp).toBeDefined();
  });
});