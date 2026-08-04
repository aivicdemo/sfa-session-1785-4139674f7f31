import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import { evaluateReportRetentionAndScheduleDeletion } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 期限切れレポート自動削除', () => {
  let mockFileStorageAdapter: {
    deleteExpiredReports: jest.Mock;
  };
  let mockReportMetadata: Array<{
    reportId: string;
    createdAt: string;
    retentionDeadlineAt: string;
  }>;
  let currentTime: Date;

  beforeEach(() => {
    currentTime = new Date('2026-08-15T10:00:00Z');
    
    mockFileStorageAdapter = {
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined),
    };

    mockReportMetadata = [];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // SCEN-172
  test('保持期限直前のレポートが削除対象外として判定される', async () => {
    // 保持期限が現在時刻の24時間以内（保持期限直前）のレポート
    // 現在時刻: 2026-08-15T10:00:00Z
    // 保持期限: 2026-08-16T09:59:59Z (24時間以内)
    const reportIdNearDeadline = 'report-near-deadline-001';
    const retentionDeadlineNearExpiry = '2026-08-16T09:59:59Z';
    
    // 保持期限を既に過ぎたレポート（削除対象となるべき）
    const reportIdExpired = 'report-expired-001';
    const retentionDeadlineExpired = '2026-08-15T09:59:59Z';

    mockReportMetadata = [
      {
        reportId: reportIdNearDeadline,
        createdAt: '2026-08-14T10:00:00Z',
        retentionDeadlineAt: retentionDeadlineNearExpiry,
      },
      {
        reportId: reportIdExpired,
        createdAt: '2026-08-13T10:00:00Z',
        retentionDeadlineAt: retentionDeadlineExpired,
      },
    ];

    // 削除対象判定ロジックを実行
    const result = await evaluateReportRetentionAndScheduleDeletion(
      mockReportMetadata,
      mockFileStorageAdapter,
      currentTime,
    );

    // 期待結果: 保持期限直前のレポートは削除対象外と判定される
    expect(result.reportsToDelete).toEqual([reportIdExpired]);
    expect(result.reportsToPreserve).toEqual([reportIdNearDeadline]);

    // deleteExpiredReportsメソッドが呼び出された回数を検証
    // 削除対象レポートは1件のみ
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.deleteExpiredReports).toHaveBeenCalledWith([
      reportIdExpired,
    ]);

    // 保持期限直前のレポートに対しては呼び出されないことを検証
    const callArgs = mockFileStorageAdapter.deleteExpiredReports.mock.calls[0][0];
    expect(callArgs).not.toContain(reportIdNearDeadline);
  });
});