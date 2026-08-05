import { describe, test, expect, beforeEach } from '@jest/globals';
import { generateCorrelationAnalysisReport } from '../../src/logic/it-1-br-2-1-1-1';

describe('AIエージェント推論精度の自動監視とアラート機能', () => {
  // SCEN-1208
  test('相関分析レポート生成機能 - 成約実績データベースへのアクセスに失敗したとき処理がエラーになる', async () => {
    const analysisPeriodStartDate = new Date('2024-01-01T00:00:00Z');
    const analysisPeriodEndDate = new Date('2024-01-31T23:59:59Z');
    const salesProcessDefinitionId = 'proc_def_001';
    const targetSalesRepresentativeIds = ['rep_001', 'rep_002'];

    const mockDbClient = {
      fetchContractionResults: jest.fn().mockRejectedValueOnce(
        new Error('ConnectionError: Failed to connect to database')
      ),
      fetchSalesActivityData: jest.fn().mockResolvedValueOnce([]),
      fetchProcessComplianceData: jest.fn().mockResolvedValueOnce([]),
    };

    const mockReportGenerator = {
      client: mockDbClient,
    };

    await expect(
      generateCorrelationAnalysisReport(
        {
          analysisPeriodStartDate,
          analysisPeriodEndDate,
          salesProcessDefinitionId,
          targetSalesRepresentativeIds,
        },
        mockReportGenerator
      )
    ).rejects.toThrow(/DB_CONNECTION_FAILED/);
  });
});