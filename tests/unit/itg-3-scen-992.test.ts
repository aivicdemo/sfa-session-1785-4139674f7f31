import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 推奨レポート生成・保存機能', () => {
  test('SCEN-992: FileStorageAdapterのuploadRecommendationReportが2回連続で失敗したとき、HTML画面表示処理に切り替わる', async () => {
    // Setup: FileStorageAdapter のモック化
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 初回呼び出しで NetworkError を投げるよう設定
    const networkError = new Error('Network connection failed');
    networkError.name = 'NetworkError';

    // モックの戻り値設定: 2回連続で失敗
    mockFileStorageAdapter.uploadRecommendationReport
      .mockRejectedValueOnce(networkError)
      .mockRejectedValueOnce(networkError);

    // テスト入力データ: 推奨レポートと営業案件情報
    const reportData = {
      recommendationId: 'rec-12345',
      content: 'Sales approach recommendation based on customer profile analysis',
      format: 'pdf',
      timestamp: '2024-06-15T10:30:00Z',
      dealId: 'deal-67890',
      customerId: 'cust-11111',
    };

    const dealInfo = {
      dealId: 'deal-67890',
      customerName: 'Acme Corporation',
      industry: 'Technology',
      annualRevenue: 50000000,
      contactPerson: 'John Doe',
      proposalContent: 'Cloud migration consulting package',
      proposedAmount: 500000,
      timeline: '2024-Q3',
    };

    // 実行: 推奨レポート生成・保存処理を実行
    const result = await generateRecommendationReportWithFallback(
      reportData,
      dealInfo,
      mockFileStorageAdapter,
    );

    // 検証 1: FileStorageAdapter.uploadRecommendationReport が 2 回呼び出されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    // 検証 2: 1 回目のリトライが 3 秒後に実行されたことを確認（スケジュール確認）
    // 検証 3: 2 回目のリトライが 10 秒後に実行されたことを確認（スケジュール確認）
    // Note: jest.useFakeTimers を使用する場合、テストフレームワークで時間管理を行う

    // 検証 4: レスポンスの形式と内容を検証
    expect(result).toBeDefined();
    expect(result.fallbackTriggered).toBe(true);
    expect(result.displayFormat).toBe('html');

    // 検証 5: 推奨内容が HTML 形式で組み立てられていることを確認
    expect(result.htmlContent).toBeDefined();
    expect(result.htmlContent).toContain('<html');
    expect(result.htmlContent).toContain(reportData.content);
    expect(result.htmlContent).toContain(dealInfo.customerName);

    // 検証 6: ユーザー向けメッセージの確認
    expect(result.userMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください',
    );

    // 検証 7: ユーザーがブラウザ保存機能を使用可能な状態であることを確認
    expect(result.isBrowserSaveable).toBe(true);

    // 検証 8: S3 アップロード失敗ログが記録されていることを確認
    expect(result.uploadFailureLog).toBeDefined();
    expect(result.uploadFailureLog.attemptCount).toBe(2);
    expect(result.uploadFailureLog.errors).toHaveLength(2);
    expect(result.uploadFailureLog.errors[0]).toMatch(/Network/);
    expect(result.uploadFailureLog.errors[1]).toMatch(/Network/);
    expect(result.uploadFailureLog.recordedAt).toBeDefined();
  });
});