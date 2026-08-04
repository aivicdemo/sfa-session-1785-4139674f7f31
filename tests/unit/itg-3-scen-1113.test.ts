import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポート生成失敗時のフォールバック', () => {
  // SCEN-1113
  test('Amazon S3へのアップロードが再試行2回目でも失敗したとき、HTML形式での画面表示に切り替わる', async () => {
    const dealCondition = {
      customerId: 'CUST-20240115-001',
      customerName: '株式会社サンプル',
      industry: 'IT',
      companySize: 'large',
      productCategory: 'CloudServices',
      budgetRange: 'over_50m',
      dealStage: 'negotiation',
      dealAmount: 75000000,
    };

    const recommendationContent = {
      customerId: dealCondition.customerId,
      customerName: dealCondition.customerName,
      recommendedApproach: '段階的クラウド導入計画',
      proposalStrategy: '既存システムとの並行運用を重視',
      riskFactors: ['統合テストスケジュール遅延リスク'],
      successPatternDetails: {
        patternId: 'PAT-20240101-001',
        customerType: 'large_it_company',
        adoptionPhase: 'phase2_integration',
        successRate: 0.87,
        averageDeploymentDays: 180,
      },
      reasoning: {
        matchScore: 0.92,
        keyEvidence: [
          '過去の大規模IT企業での成功事例3件',
          '同業界での導入実績18ヶ月',
          '予算規模との適合度95%',
        ],
        alternativeApproaches: ['急速全置換方式', '部分導入パイロット'],
      },
      operationHistory: [
        {
          action: 'recommendation_generated',
          timestamp: '2024-01-15T11:00:00Z',
          actor: 'ai_agent',
        },
        {
          action: 'report_generation_started',
          timestamp: '2024-01-15T11:00:05Z',
          actor: 'system',
        },
      ],
    };

    let attemptCount = 0;
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        attemptCount++;
        if (attemptCount === 1) {
          const error = new Error('Upload timeout');
          (error as any).code = 'TIMEOUT';
          throw error;
        } else if (attemptCount === 2) {
          const error = new Error('Connection failed');
          (error as any).code = 'CONNECTION_FAILED';
          throw error;
        } else if (attemptCount === 3) {
          const error = new Error('Authorization denied');
          (error as any).code = 'AUTH_ERROR';
          throw error;
        }
        return { url: 'https://example.com/report.pdf' };
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(async () => recommendationContent),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const result = await generateRecommendationReportWithFallback(
      dealCondition,
      mockAIRecommendationEngine,
      mockFileStorageAdapter,
    );

    expect(result.success).toBe(false);
    expect(result.uploadFailed).toBe(true);
    expect(result.retryCount).toBe(3);
    expect(result.userMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください',
    );
    expect(result.fallbackFormat).toBe('HTML');
    expect(result.htmlContent).toBeDefined();

    const htmlContent = result.htmlContent as string;
    expect(htmlContent).toContain(dealCondition.customerName);
    expect(htmlContent).toContain('段階的クラウド導入計画');
    expect(htmlContent).toContain('既存システムとの並行運用を重視');
    expect(htmlContent).toContain('統合テストスケジュール遅延リスク');
    expect(htmlContent).toContain('PAT-20240101-001');
    expect(htmlContent).toContain('0.92');
    expect(htmlContent).toContain('過去の大規模IT企業での成功事例3件');
    expect(htmlContent).toContain('recommendation_generated');
    expect(htmlContent).toContain('report_generation_started');

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);
    expect(attemptCount).toBe(3);
  });
});