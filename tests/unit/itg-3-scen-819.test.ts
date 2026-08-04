import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化 - ファイルストレージ連携失敗時振る舞い', () => {
  // SCEN-819
  test('S3アップロード失敗時、HTML形式の推奨内容が画面上に表示され、ユーザーがブラウザ保存機能で取得可能', () => {
    // Arrange
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        proposalApproach: '顧客の経営課題に対して段階的なソリューション導入を推奨',
        trustScore: 85,
        rationale: {
          similarPatterns: ['pattern-A', 'pattern-B'],
          successFactors: ['要因1', '要因2'],
          customerContext: '同業種・同規模での成功事例から抽出',
        },
        timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue('詳細な根拠説明'),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(85),
    };

    let uploadAttemptCount = 0;
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockImplementation(async () => {
        uploadAttemptCount++;
        if (uploadAttemptCount <= 2) {
          throw new Error('S3 upload failed: Network timeout');
        }
        throw new Error('S3 upload failed: Max retries exceeded');
      }),
      generateDownloadUrl: jest.fn().mockResolvedValue('https://s3.example.com/report.pdf'),
      deleteExpiredReports: jest.fn().mockResolvedValue(undefined),
    };

    const customerInfo = {
      customerId: 'cust-001',
      customerName: '株式会社テスト商社',
      industry: '商社',
      employeeCount: 150,
    };

    const dealConditions = {
      dealId: 'deal-001',
      dealTitle: '新規システム導入提案',
      dealStage: '初期接触',
      budget: 5000000,
      decisionTimeline: '2024-03-31',
    };

    // Act
    const result = generateRecommendationReportWithFallback(
      customerInfo,
      dealConditions,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert
    expect(result).resolves.toMatchObject({
      success: false,
      fallbackApplied: true,
      errorMessage: /レポート生成に失敗しました/,
      htmlContent: expect.any(String),
      displayFormat: 'html',
      contentIncludedFields: {
        recommendationContent: true,
        rationale: true,
        dealConditions: true,
      },
      userMessage: 'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください',
    });

    // S3アップロード失敗後、再試行が実行されたことを確認（最大2回）
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);
  });
});