import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-182
  test('営業プロセス標準書の要件仕様変換機能 - データ項目仕様が空配列のとき、入力値不正エラーが発生する', () => {
    const invalidRequest = {
      processName: 'sales_process_v1',
      version: '1.0.0',
      dataItems: [],
      stages: [
        {
          stageName: 'initial_contact',
          stageOrder: 1,
          requiredFields: ['customer_name', 'contact_date'],
        },
      ],
      transitionRules: [
        {
          fromStage: 'initial_contact',
          toStage: 'proposal',
          condition: 'proposal_accepted',
        },
      ],
      kpiCriteria: [
        {
          kpiName: 'conversion_rate',
          targetValue: 0.6,
          measurementUnit: 'ratio',
        },
      ],
    };

    expect(() =>
      convertProcessStandardToSystemRequirements(invalidRequest)
    ).toThrow(/データ項目仕様/);
  });
});