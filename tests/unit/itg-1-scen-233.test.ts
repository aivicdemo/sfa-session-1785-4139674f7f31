import { calculateProcessComplianceScore } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-233: [error] 標準プロセス遵守度スコア計算機能 - 営業プロセス定義の参照に失敗したときエラーになる
  test('should throw error with specific code and message when process definition service fails', () => {
    const processId = 'PROC-001';

    expect(() => {
      calculateProcessComplianceScore({
        processId,
        processDefinitionServiceError: {
          statusCode: 500,
          message: 'プロセス定義の取得に失敗しました',
        },
      });
    }).toThrow(/ERR_PROCESS_DEFINITION_LOAD_FAILED/);

    expect(() => {
      calculateProcessComplianceScore({
        processId,
        processDefinitionServiceError: {
          statusCode: 500,
          message: 'プロセス定義の取得に失敗しました',
        },
      });
    }).toThrow(/標準プロセス定義の参照に失敗しました/);

    expect(() => {
      calculateProcessComplianceScore({
        processId,
        processDefinitionServiceError: {
          statusCode: 500,
          message: 'プロセス定義の取得に失敗しました',
        },
      });
    }).toThrow(/PROC-001/);
  });
});