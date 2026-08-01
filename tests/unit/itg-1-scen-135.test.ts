import { convertProcessStandardToSystemRequirement } from '../../src/logic/it-1-br-2-1-1';

describe('営業プロセス標準書のシステム要件変換機能', () => {
  // SCEN-135
  test('判定基準の条件式が空文字列の場合、変換処理がエラーになる', () => {
    const criteria = {
      criteriaId: 'CRIT-001',
      criteriaName: '初回接触基準',
      conditionExpression: '',
      judgmentResult: 'PASS',
      processStageId: 'STAGE-001',
    };

    expect(() => convertProcessStandardToSystemRequirement(criteria)).toThrow(/条件式/);
  });
});