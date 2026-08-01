import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  test('SCEN-134: 判定基準の条件式が欠落している場合、変換処理がエラーになる', () => {
    const processStandardWithMissingCondition = {
      processId: 'PROC-001',
      processName: '営業プロセス標準',
      stages: [
        {
          stageId: 'STAGE-001',
          stageName: '初回接触',
          criteria: [
            {
              criteriaId: 'CRIT-001',
              criteriaName: '顧客接触確認',
              conditionExpression: null,
              dataItems: ['customer_id', 'contact_date'],
            },
          ],
        },
      ],
    };

    expect(() =>
      convertProcessStandardToSystemRequirement(processStandardWithMissingCondition)
    ).toThrow(/条件式/);
  });
});