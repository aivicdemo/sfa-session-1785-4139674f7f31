import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポート生成・保存', () => {
  // SCEN-692
  test('推奨内容のレポート生成・保存機能 - レポートのダウンロードURLの有効期限が切れたとき、URLは無効になる', () => {
    const currentTime = new Date('2024-06-15T10:00:00Z');
    const expiredTime = new Date('2024-06-15T09:00:00Z');

    const recommendationData = {
      recommendationId: 'REC-001',
      customerId: 'CUST-12345',
      proposalApproach: '顧客の経営課題に対応したデジタル化提案',
      reasoningBasis: [
        {
          dataSource: '過去成功事例DB',
          evidenceDescription: '類似業種・規模での成功案件3件で同様のアプローチが適用され、成約率85%を達成',
          confidenceScore: 88
        },
        {
          dataSource: '顧客購買履歴',
          evidenceDescription: '過去12ヶ月の購買パターンから6ヶ月周期で予算配分があることを確認',
          confidenceScore: 82
        }
      ],
      overallConfidenceScore: 85,
      generatedAt: currentTime.toISOString()
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: 'reports/REC-001_2024-06-15.pdf',
        uploadedAt: currentTime.toISOString()
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: 'https://storage.example.com/reports/REC-001_2024-06-15.pdf?token=abc123',
        expiresAt: expiredTime.toISOString(),
        fileKey: 'reports/REC-001_2024-06-15.pdf'
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({ deletedCount: 0 })
    };

    const result = generateRecommendationReport(
      recommendationData,
      fileStorageAdapterStub,
      currentTime
    );

    expect(result).toEqual({
      status: 'URL_EXPIRED',
      downloadUrl: 'https://storage.example.com/reports/REC-001_2024-06-15.pdf?token=abc123',
      expiresAt: expiredTime.toISOString(),
      errorCode: 'URL_EXPIRED',
      errorMessage: 'ダウンロードリンクの有効期限が切れています。レポートを再度生成してください',
      isAccessible: false,
      recommendationId: 'REC-001'
    });

    expect(fileStorageAdapterStub.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: 'REC-001',
        customerId: 'CUST-12345'
      })
    );

    expect(fileStorageAdapterStub.generateDownloadUrl).toHaveBeenCalledWith(
      'reports/REC-001_2024-06-15.pdf'
    );
  });
});