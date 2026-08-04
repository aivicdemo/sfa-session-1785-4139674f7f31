import { generateRecommendationReportWithSignedUrl } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-1981
  test('[normal] 経営層向け説得資料の自動生成機能 - ファイルアップロード成功時に有効期限付きのダウンロードURLが生成される', async () => {
    const proposalId = 'prop-20240115-001';
    const customerId = 'cust-20240115-001';
    const proposalContent = {
      title: '経営層向け提案資料',
      executiveSummary: '投資対効果の分析結果',
      businessCase: '年間売上向上3000万円を見込む',
      riskFactors: ['導入期間3ヶ月の業務負荷増加', '初期投資500万円'],
      recommendedActions: ['段階的な導入体制を構築', 'チェンジマネジメント支援の実施'],
    };
    const pdfFileContent = Buffer.from('PDF_MOCK_CONTENT_' + 'x'.repeat(2500000));
    const fileMetadata = {
      fileName: 'executive-proposal-20240115.pdf',
      contentType: 'application/pdf',
      fileSizeBytes: pdfFileContent.length,
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: 'reports/prop-20240115-001/executive-proposal-20240115.pdf',
        uploadedAt: '2024-01-15T11:00:00Z',
        fileSizeBytes: pdfFileContent.length,
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl:
          'https://s3.amazonaws.com/sales-ai-bucket/reports/prop-20240115-001/executive-proposal-20240115.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20240115%2Fap-northeast-1%2Fs3%2Faws4_request&X-Amz-Date=20240115T110000Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
        expiresInSeconds: 3600,
        generatedAt: '2024-01-15T11:00:00Z',
      }),
    };

    const result = await generateRecommendationReportWithSignedUrl(
      {
        proposalId,
        customerId,
        proposalContent,
        fileMetadata,
        pdfFileContent,
      },
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        proposalId,
        customerId,
        fileMetadata,
      })
    );

    expect(mockFileStorageAdapter.generateDownloadUrl).toHaveBeenCalledWith(
      expect.objectContaining({
        fileKey: 'reports/prop-20240115-001/executive-proposal-20240115.pdf',
      })
    );

    expect(result).toBeDefined();
    expect(result.downloadUrl).toContain('https://s3.amazonaws.com/sales-ai-bucket/');
    expect(result.downloadUrl).toContain('X-Amz-Expires=3600');
    expect(result.downloadUrl).toContain('X-Amz-Signature=');
    expect(result.downloadUrl).toContain('X-Amz-Algorithm=AWS4-HMAC-SHA256');
    expect(result.downloadUrl).toContain('X-Amz-Date=');
    expect(result.expiresInSeconds).toBe(3600);
    expect(result.downloadUrl).toMatch(/X-Amz-Signature=[a-f0-9]{64}/);
  });
});