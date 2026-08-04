import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('成功パターン抽出と新規案件への提案アプローチ推奨機能', () => {
  // SCEN-2069
  test('推奨内容がAmazon S3へのアップロード失敗時、HTML形式の画面表示による代替動作が実行される', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendedApproach: '顧客の経営課題に対応した段階的な提案',
        confidenceScore: 85,
        reasoning: '過去の類似事例から抽出した成功パターンに基づく',
        similarPatterns: [
          {
            caseId: 'CASE-001',
            matchScore: 92,
            industry: '製造業',
            companySize: '1000名以上',
            successFactor: '複数部門への段階的提案'
          }
        ]
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        {
          patternId: 'PAT-001',
          relevanceScore: 88,
          description: '大規模製造業への提案パターン'
        }
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '貴社の業界と規模から、成功事例CASE-001が92%の一致度で適用可能と判定されました。'
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(78)
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockRejectedValue(
        new Error('503 Service Unavailable')
      ),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    const newDealCondition = {
      customerId: 'CUST-2024-001',
      industry: '製造業',
      companySize: '1500名',
      dealDescription: '生産効率化ソリューション導入',
      dealValue: 5000000,
      dealStage: '初回提案準備'
    };

    const result = await generateRecommendationWithFallback(
      newDealCondition,
      mockAIEngine,
      mockFileStorageAdapter
    );

    expect(result.uploadStatus).toBe('failed');
    expect(result.fallbackApplied).toBe(true);
    expect(result.displayFormat).toBe('html');
    expect(result.htmlContent).toContain('推奨内容');
    expect(result.htmlContent).toContain('顧客の経営課題に対応した段階的な提案');
    expect(result.htmlContent).toContain('85');
    expect(result.htmlContent).toContain(
      '過去の類似事例から抽出した成功パターンに基づく'
    );
    expect(result.htmlContent).toContain('CASE-001');
    expect(result.htmlContent).toContain('92');
    expect(result.errorMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください'
    );
    expect(result.userMessage).not.toContain('503');
    expect(result.userMessage).not.toContain('Service Unavailable');
    expect(result.isBrowserSaveable).toBe(true);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();
  });
});