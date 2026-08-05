import { convertProcessRequirements } from '../../src/logic/it-1';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-181
  test('要件仕様変換機能でデータ項目仕様がnullの場合、入力値未設定エラーが発生する', () => {
    const input = {
      processStandardBookId: 'PSB-001',
      processName: '営業プロセス標準書',
      stages: [
        {
          stageId: 'STAGE-001',
          stageName: '初回接触',
          dataItemSpecs: null,
          transitionRules: [
            {
              ruleId: 'RULE-001',
              condition: 'initial_contact_completed',
              nextStageId: 'STAGE-002'
            }
          ]
        }
      ]
    };

    expect(() => convertProcessRequirements(input)).toThrow(/入力値が設定されていません/);
  });
});