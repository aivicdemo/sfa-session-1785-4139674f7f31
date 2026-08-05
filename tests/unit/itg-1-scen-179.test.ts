import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-179
  test('[error] 営業プロセス標準書の要件仕様変換機能 - 判定基準の定義が null のとき、入力値未設定エラーが発生する', () => {
    const processStandardInput = {
      processId: 'PROC-001',
      processName: '営業プロセス標準',
      stages: [
        {
          stageId: 'STAGE-01',
          stageName: '初回接触',
          description: '顧客への初回接触を実行',
          sequenceOrder: 1,
        },
      ],
      judgmentCriteria: null,
      kpiDefinition: {
        kpiId: 'KPI-001',
        kpiName: '初回接触率',
        targetValue: 85,
        unit: 'percent',
      },
    };

    expect(() =>
      convertProcessStandardToSystemRequirements(processStandardInput)
    ).toThrow(/判定基準/);
  });
});