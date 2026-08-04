import { generateRecommendationReportWithExpiredUrl } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-244
  test('推奨内容のレポート出力・共有機能 - ダウンロードURLの有効期限が既に切れているとき、ダウンロード可能な状態のURLが返却されずエラーになる', () => {
    const currentTime = new Date('2026-08-02T10:00:00Z');
    const expiredUrlExpirationTime = new Date('2026-08-01T09:00:00Z');

    const mockFileStorageAdapter = {
      generateDownloadUrl: jest.fn().mockResolvedValue({
        url: 'https://s3.example.com/reports/recommendation-123.pdf?token=expired_token',
        expiresAt: expiredUrlExpirationTime.toISOString(),
      }),
      uploadRecommendationReport: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const reportId = 'report-recommendation-2026-08-01-123';
    const recommendationData = {
      customerId: 'cust-999',
      proposalContent: '新規営業支援パッケージ',
      confidenceScore: 85,
      reasoningBasis: [
        {
          factor: '顧客業種',
          value: '製造業',
          weight: 0.3,
        },
        {
          factor: '過去成功パターン一致度',
          value: 0.92,
          weight: 0.5,
        },
        {
          factor: 'タイミング適合性',
          value: 0.78,
          weight: 0.2,
        },
      ],
    };

    const result = generateRecommendationReportWithExpiredUrl(
      reportId,
      recommendationData,
      mockFileStorageAdapter,
      currentTime,
    );

    expect(result).toEqual({
      success: false,
      statusCode: 400,
      errorCode: 'DOWNLOAD_URL_EXPIRED',
      errorMessage:
        'ダウンロードリンクの有効期限が切れています。レポートを再度生成してください',
      downloadUrl: null,
    });

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      reportId,
    );
  });
});