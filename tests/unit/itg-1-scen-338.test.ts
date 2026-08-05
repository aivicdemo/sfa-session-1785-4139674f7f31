import { runTx3Imp1Agent } from '../../src/logic/it-1';
import * as fs from 'fs';
import * as path from 'path';

describe('営業プロセス実行状況の監査ダッシュボード', () => {
  // SCEN-338
  test('システムヘルスチェック実行機能 - レポート出力先ディレクトリが存在しないときエラーが発生する', async () => {
    const nonexistentReportDir = '/nonexistent/health-check-reports';
    
    const mockAiClient = {
      analyzeHealthCheck: jest.fn().mockResolvedValue({
        systemStatus: 'healthy',
        uptime: 99.95,
        timestamp: '2024-01-15T11:00:00Z',
        diagnostics: {
          cpu: { usage: 45, status: 'normal' },
          memory: { usage: 62, status: 'normal' },
          database: { connection_status: 'connected', latency_ms: 120 }
        }
      }),
      analyzeDataQuality: jest.fn().mockResolvedValue({
        overall_score: 96,
        validation_errors: 2,
        duplicate_records: 0,
        timestamp: '2024-01-15T11:00:00Z'
      }),
      evaluateInferenceAccuracy: jest.fn().mockResolvedValue({
        accuracy_score: 94,
        precision: 0.92,
        recall: 0.96,
        timestamp: '2024-01-15T11:00:00Z'
      })
    };

    const config = {
      reportOutputDir: nonexistentReportDir,
      aiClient: mockAiClient,
      triggerType: 'scheduled' as const,
      timestamp: '2024-01-15T11:00:00Z'
    };

    let thrownError: Error | null = null;

    try {
      await runTx3Imp1Agent(config);
    } catch (error) {
      thrownError = error as Error;
    }

    expect(thrownError).not.toBeNull();
    
    const errorMessage = thrownError!.message;
    const errorCode = (thrownError as NodeJS.ErrnoException).code;
    
    const hasDirectoryError = /出力先ディレクトリが存在しません|ディレクトリパス:\/nonexistent\/health-check-reports/.test(errorMessage);
    const hasFileSystemError = errorCode === 'ENOENT' || errorCode === 'EACCES' || /ENOENT|EACCES/.test(errorMessage);
    
    expect(hasDirectoryError || hasFileSystemError).toBe(true);

    expect(mockAiClient.analyzeHealthCheck).toHaveBeenCalled();
    expect(mockAiClient.analyzeDataQuality).toHaveBeenCalled();
    expect(mockAiClient.evaluateInferenceAccuracy).toHaveBeenCalled();

    const reportFilePath = path.join(nonexistentReportDir, `health-check-report-${new Date('2024-01-15T11:00:00Z').toISOString().split('T')[0]}.json`);
    const reportDirExists = fs.existsSync(nonexistentReportDir);
    expect(reportDirExists).toBe(false);
    
    const partialReportExists = fs.existsSync(reportFilePath);
    expect(partialReportExists).toBe(false);
  });
});