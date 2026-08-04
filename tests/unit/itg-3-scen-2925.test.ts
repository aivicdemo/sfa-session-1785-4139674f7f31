import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - Amazon S3連携エラーハンドリング', () => {
  test('SCEN-2925: generateDownloadUrlが想定外の値を返した場合、URLの妥当性が検証され、代替動作が実行される', () => {
    // Setup: FileStorageAdapterスタブを定義
    const invalidUrls = [
      null,
      undefined,
      '',
      'ftp://invalid-bucket/object',
      'https://s3.amazonaws.com/',
      'https://s3.amazonaws.com/bucket',
      'https://s3.amazonaws.com/bucket/key',
    ];

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const recommendationData = {
      recommendationId: 'rec-20240115-001',
      customerId: 'cust-12345',
      dealId: 'deal-98765',
      proposedApproach: 'Customer needs aligned with product features',
      confidenceScore: 85,
      basedOnPatterns: [
        { patternId: 'pat-001', matchScore: 0.92, historicalCaseCount: 15 },
        { patternId: 'pat-002', matchScore: 0.78, historicalCaseCount: 8 },
      ],
      recommendationReasoning: 'Similar customer segment showed 88% adoption rate',
      timestamp: '2024-01-15T11:00:00Z',
    };

    for (const invalidUrl of invalidUrls) {
      mockFileStorageAdapter.generateDownloadUrl.mockResolvedValueOnce(invalidUrl);

      const result = generateRecommendationReportWithFallback(
        recommendationData,
        mockFileStorageAdapter
      );

      // Assertion: URLの妥当性検証に失敗し、代替動作が実行されることを確認
      expect(result).toEqual({
        status: 'fallback_applied',
        userMessage: 'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください',
        htmlReportContent: expect.stringContaining('<html>'),
        downloadUrl: null,
        errorLog: expect.stringMatching(/generateDownloadUrlが不正なURL値を返却した/),
        recommendationData: recommendationData,
      });

      // Assertion: エラーログには詳細情報が記録されていることを確認
      expect(result.errorLog).toContain('recommendationId: rec-20240115-001');
      expect(result.errorLog).toContain('generatedUrl: ');

      // Assertion: HTML形式のレポートが生成されていることを確認
      expect(result.htmlReportContent).toContain('推奨アプローチ');
      expect(result.htmlReportContent).toContain('Customer needs aligned with product features');
      expect(result.htmlReportContent).toContain('信頼度スコア: 85');
      expect(result.htmlReportContent).toContain('根拠データ');
      expect(result.htmlReportContent).toContain('pat-001');
      expect(result.htmlReportContent).toContain('0.92');

      mockFileStorageAdapter.generateDownloadUrl.mockClear();
    }
  });
});