import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-612: 推奨レポート生成・保存機能 - 推奨内容がPDF形式で生成されAmazon S3にアップロードされる', () => {
    // テストデータ準備
    const caseData = {
      customerId: 'cust_001',
      customerName: 'A社',
      dealAmount: 5000000,
      industry: '製造業',
      challenge: '生産効率化',
      recommendationId: '12345',
      generatedAt: new Date('2026-01-15T10:30:00Z'),
    };

    // AIRecommendationEngineのスタブ
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: '12345',
        proposalApproach: 'IoT導入による工程管理',
        successPatternScore: 95,
        rootCause: '過去成功パターンマッチ度95%',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    // FileStorageAdapterのスタブ
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        s3ObjectKey: 'recommendations/2026-01-15/A社_推奨レポート_12345.pdf',
        downloadUrl: 'https://s3.amazonaws.com/bucket/recommendations/2026-01-15/A社_推奨レポート_12345.pdf',
        expiresAt: new Date('2026-01-22T10:30:00Z'),
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // PDF生成関数のスパイ
    const mockPdfGenerator = jest.fn().mockReturnValue(Buffer.from('mock_pdf_content'));

    // 推奨レポート生成・保存機能を呼び出し
    const result = generateRecommendationReport(
      caseData,
      mockAIEngine,
      mockFileStorage,
      mockPdfGenerator
    );

    // (1) PDF形式のレポートが生成されていることを確認
    expect(mockPdfGenerator).toHaveBeenCalled();
    const pdfCallArgs = mockPdfGenerator.mock.calls[0][0];
    expect(pdfCallArgs).toContain('提案アプローチ：IoT導入による工程管理');
    expect(pdfCallArgs).toContain('過去成功パターンマッチ度95%');
    expect(pdfCallArgs).toContain('ヘッダー');
    expect(pdfCallArgs).toContain('根拠');
    expect(pdfCallArgs).toContain('2026-01-15T10:30:00Z');

    // (2) FileStorageAdapterのuploadRecommendationReportメソッドが1回だけ呼び出されたことを確認
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalledTimes(1);

    // (3) uploadRecommendationReportメソッドへの引数がPDF形式とメタデータを含んでいることを確認
    const uploadCallArgs = mockFileStorage.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadCallArgs.pdfBuffer).toBeDefined();
    expect(uploadCallArgs.fileName).toBe('A社_推奨レポート_12345.pdf');
    expect(uploadCallArgs.metadata).toEqual({
      customerId: 'cust_001',
      generatedAt: new Date('2026-01-15T10:30:00Z'),
      recommendationId: '12345',
    });

    // (4) S3へのアップロードが成功し、オブジェクトキーが返されることを確認
    expect(result.s3ObjectKey).toBe('recommendations/2026-01-15/A社_推奨レポート_12345.pdf');
    expect(result.downloadUrl).toBe('https://s3.amazonaws.com/bucket/recommendations/2026-01-15/A社_推奨レポート_12345.pdf');

    // (5) レポートメタデータテーブルにレコードが保存されていることを確認
    expect(result.reportMetadata).toEqual({
      s3ObjectKey: 'recommendations/2026-01-15/A社_推奨レポート_12345.pdf',
      fileFormat: 'PDF',
      generatedAt: new Date('2026-01-15T10:30:00Z'),
      expiresAt: new Date('2026-01-22T10:30:00Z'),
      recommendationId: '12345',
    });

    // 有効期限が生成日時から7日後であることを確認
    const expiryTime = result.reportMetadata.expiresAt.getTime();
    const generatedTime = new Date('2026-01-15T10:30:00Z').getTime();
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    expect(expiryTime - generatedTime).toBe(sevenDaysMs);
  });
});