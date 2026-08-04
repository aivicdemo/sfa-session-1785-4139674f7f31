import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - レポート生成・ファイル保存', () => {
  // SCEN-2741
  test('PDF形式でのファイル出力に失敗した場合、推奨内容がHTML形式で画面表示される', async () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '顧客の業界特性に基づいたカスタマイズ提案',
        rootCauses: [
          {
            factor: '顧客規模が中堅企業',
            weight: 0.35,
          },
          {
            factor: '導入予算が500万円以上',
            weight: 0.30,
          },
          {
            factor: '実装期間が6ヶ月以内',
            weight: 0.25,
          },
        ],
        relatedPatterns: [
          {
            patternId: 'PAT-001',
            successRate: 0.87,
            similarityScore: 0.92,
          },
          {
            patternId: 'PAT-002',
            successRate: 0.79,
            similarityScore: 0.88,
          },
        ],
        confidenceScore: 87,
      }),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockRejectedValue(
        new Error('S3アップロード失敗: ネットワークエラー')
      ),
    };

    const inputData = {
      customerId: 'CUST-20240115-001',
      customerName: 'テスト顧客株式会社',
      industry: 'IT',
      companySize: '中堅企業',
      dealAmount: 5000000,
      implementationPeriodMonths: 6,
      dealConditions: {
        budget: 5000000,
        requiredFeatures: ['クラウド対応', 'API連携', 'レポート機能'],
      },
    };

    const result = await generateRecommendationReport(
      inputData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result.outputFormat).toBe('HTML');
    expect(result.displayContent).toBeDefined();
    expect(result.displayContent).toContain('顧客の業界特性に基づいたカスタマイズ提案');
    expect(result.displayContent).toContain('PAT-001');
    expect(result.displayContent).toContain('87');
    expect(result.errorMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください'
    );
    expect(result.isFileSaved).toBe(false);
    expect(result.canBrowserSave).toBe(true);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);
  });
});