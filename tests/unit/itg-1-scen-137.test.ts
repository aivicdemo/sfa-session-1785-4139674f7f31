import { convertProcessStandardToSystemRequirements } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-137
  test('データ項目の必須フラグが欠落している場合、デフォルト値で要件仕様が生成される', () => {
    const processStandardInput = {
      processId: 'PROC-001',
      processName: '標準営業プロセス',
      stages: [
        {
          stageId: 'STAGE-01',
          stageName: '初回接触',
          dataItems: [
            {
              dataItemName: '顧客ID',
              dataType: '文字列',
              // required フィールドを意図的に欠落させる
            },
          ],
        },
      ],
    };

    const result = convertProcessStandardToSystemRequirements(processStandardInput);

    // 生成された要件仕様のデータ項目『顧客ID』に対して、必須フラグのデフォルト値が『false』で設定されていることを検証
    expect(result.systemRequirements.stages[0].dataItems[0].dataItemName).toBe('顧客ID');
    expect(result.systemRequirements.stages[0].dataItems[0].dataType).toBe('文字列');
    expect(result.systemRequirements.stages[0].dataItems[0].required).toBe(false);

    // デフォルト値適用ログに正しいメッセージが記録されていることを検証
    expect(result.defaultValueAppliedLogs).toContain(
      'データ項目「顧客ID」の必須フラグが欠落しているため、デフォルト値false を適用しました'
    );
  });
});