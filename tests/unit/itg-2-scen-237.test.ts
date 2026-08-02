import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1-br-2-1-2-1';

describe('営業データ品質検証エンジン', () => {
  // SCEN-237
  test('プロセス段階情報が欠けているとき、要件仕様変換処理がエラーになる', () => {
    const inputWithoutProcessStage = {
      processName: '営業プロセス標準書',
      processVersion: '1.0',
      judgmentCriteria: '初回接触完了かつ提案実施',
      dataItems: ['顧客名', '接触日時', '提案内容'],
    };

    expect(() => {
      convertProcessStandardToSystemRequirement(inputWithoutProcessStage);
    }).toThrow(/プロセス段階情報|PROCESS_STAGE_MISSING/);
  });
});