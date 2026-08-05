import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-193
  test('[error] 営業プロセス標準書の要件仕様変換機能 - 外部マスタデータベースへのアクセスが失敗したとき、外部連携エラーが発生する', async () => {
    const { convertProcessRequirementsWithExternalMaster } = await import(
      '../../src/logic/it-1'
    );

    const mockSystemLogger = {
      errorLogs: [] as string[],
      error: function (message: string) {
        this.errorLogs.push(message);
      },
    };

    const mockExternalDbClient = {
      fetchDepartmentMasterData: async () => {
        throw new Error('Connection timeout');
      },
    };

    const processStandardBook = {
      id: 'PS-001',
      title: '営業プロセス標準書',
      stages: [
        {
          stageId: 'STAGE-01',
          stageName: '初回接触',
          successCriteria: '顧客との初期コンタクト実施',
        },
        {
          stageId: 'STAGE-02',
          stageName: '提案',
          successCriteria: '提案資料提出',
        },
      ],
      kpiBaseline: {
        targetContactFrequency: 2,
        targetProposalSuccessRate: 0.6,
      },
    };

    let capturedError: any = null;

    try {
      await convertProcessRequirementsWithExternalMaster(
        processStandardBook,
        mockExternalDbClient,
        mockSystemLogger
      );
    } catch (error) {
      capturedError = error;
    }

    expect(capturedError).toBeDefined();
    expect(capturedError).toBeInstanceOf(Error);
    expect(capturedError.code).toBe('EXT_DB_CONNECTION_FAILED');
    expect(capturedError.message).toBe(
      '外部マスタデータベースへの接続に失敗しました'
    );

    const errorLogRegex = /\[ERROR\] External database connection failed at \d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
    const matchingLog = mockSystemLogger.errorLogs.find((log) =>
      errorLogRegex.test(log)
    );
    expect(matchingLog).toBeDefined();
  });
});