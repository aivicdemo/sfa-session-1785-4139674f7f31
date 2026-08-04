import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-614
  test('推奨レポート生成・保存機能 - Amazon S3へのアップロードが正常完了した場合に有効期限付きダウンロードURLが生成される', async () => {
    const caseId = 'case_12345';
    const customerName = 'テスト商社';
    const s3ObjectKey = 'reports/recommendation_20240815_123456.pdf';
    const bucketName = 'sales-recommendation-bucket';
    const awsRegion = 'ap-northeast-1';
    const expiresInSeconds = 3600;
    const mockS3Url = `https://s3.${awsRegion}.amazonaws.com/${bucketName}/${s3ObjectKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA...&X-Amz-Date=20240815T120000Z&X-Amz-Expires=${expiresInSeconds}&X-Amz-SignedHeaders=host&X-Amz-Signature=abc123xyz`;

    const mockRecommendationContent = {
      caseId: caseId,
      customerName: customerName,
      recommendation: 'オンサイト営業活動による段階的な関係構築を推奨します',
      reasoning: ['過去の類似案件で初期接触から成約まで平均4ヶ月の実績', '顧客業種は製造業で、決定権者は営業部長'],
      successPatterns: ['初回訪問→技術説明会→PoC実施→本提案'],
      confidenceScore: 0.92,
      generatedAt: '2024-08-15T12:00:00Z'
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        status: 200,
        s3ObjectKey: s3ObjectKey,
        uploadedAt: '2024-08-15T12:00:00Z'
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        status: 200,
        downloadUrl: mockS3Url,
        expiresInSeconds: expiresInSeconds
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({ status: 200 })
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockRecommendationContent),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0)
    };

    const result = await generateRecommendationReport(
      {
        caseId: caseId,
        customerName: customerName,
        recommendation: mockRecommendationContent
      },
      mockFileStorageAdapter,
      mockAIRecommendationEngine
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        caseId: caseId,
        fileName: expect.stringMatching(/^recommendation_\d{8}_\d{6}\.pdf$/)
      })
    );

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        s3ObjectKey: s3ObjectKey,
        expiresInSeconds: expiresInSeconds
      })
    );

    expect(result).toEqual({
      status: 'success',
      downloadUrl: mockS3Url,
      expiresInSeconds: expiresInSeconds,
      s3ObjectKey: s3ObjectKey,
      uploadedAt: '2024-08-15T12:00:00Z'
    });

    expect(result.downloadUrl).toMatch(/X-Amz-Expires=3600/);
    expect(result.expiresInSeconds).toBe(3600);
  });
});