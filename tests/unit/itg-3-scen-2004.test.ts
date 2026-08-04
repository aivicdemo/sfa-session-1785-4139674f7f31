import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-2004: [error] 経営層向け説得資料の自動生成機能 - FileStorageAdapterのuploadRecommendationReportが3回目の再試行をしようとするときエラーになる', async () => {
    // ================== Setup: モック FileStorageAdapter ==================
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // 1回目と2回目の呼び出しで失敗を返す
    const errorResult = { success: false, error: 'Upload failed' };
    mockFileStorageAdapter.uploadRecommendationReport
      .mockResolvedValueOnce(errorResult)
      .mockResolvedValueOnce(errorResult);

    // ================== Input: 推奨レポート生成データ ==================
    const recommendationReportInput = {
      customerId: 'CUST-001',
      customerName: '株式会社サンプル',
      industry: 'IT',
      employeeCount: 150,
      proposalContent: '提案内容：クラウドERP導入により業務効率化を実現',
      roiEstimate: 2500000,
      implementationPeriod: 6,
      pdfBinary: Buffer.from('PDF binary content for executive material'),
      format: 'PDF',
    };

    // ================== Execution ==================
    const result = await generateExecutivePersuasionMaterial(
      recommendationReportInput,
      mockFileStorageAdapter
    );

    // ================== Verification ==================
    // 再試行ロジックの確認: 最大2回まで再試行
    // 1回目の失敗 → 3秒遅延 → 2回目再試行
    // 2回目の失敗 → 10秒遅延 → (3回目は呼び出されない)
    // したがってuploadRecommendationReportの呼び出し数は2回のみ
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    // エラーメッセージの検証
    expect(result).toEqual({
      success: false,
      errorMessage: 'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください',
      internalLog: expect.stringContaining('アップロード失敗'),
      maxRetryAttemptsReached: 2,
    });

    // ログに最大再試行回数に達したことが記録されていることを確認
    expect(result.internalLog).toContain('最大再試行回数（2回）に達しました');

    // 3回目の呼び出しが行われていないことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalledTimes(3);
  });
});