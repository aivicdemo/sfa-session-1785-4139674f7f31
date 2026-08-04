import { evaluateRecommendationPrecision } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推論精度検証機能 - ファイルストレージ外部サービス失敗時の代替表示', () => {
  // SCEN-411
  test('S3アップロード失敗時に推奨内容をHTML形式で画面表示し、エラーログを記録する', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('S3_UPLOAD_FAILED'))
        .mockRejectedValueOnce(new Error('S3_UPLOAD_FAILED')),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        patternName: '成功パターン001',
        customerName: 'テスト顧客A',
        dealCondition: '新規営業案件',
        proposalApproach: '段階的提案アプローチ',
        reasoningExplanation: '過去5件の類似案件から抽出した成功パターン',
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    };

    const inputData = {
      customerId: 'CUST001',
      customerName: 'テスト顧客A',
      industry: '製造業',
      employeeCount: 500,
      dealId: 'DEAL12345',
      dealStatus: '初期段階',
      dealAmount: 5000000,
      dealCycle: 90,
    };

    const result = await evaluateRecommendationPrecision(
      inputData,
      mockFileStorageAdapter,
      mockAIRecommendationEngine,
      mockLogger
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.stringMatching(/S3アップロード失敗/)
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringMatching(/第1回目再試行開始/)
    );
    expect(mockLogger.info).toHaveBeenCalledWith(
      expect.stringMatching(/第2回目再試行開始/)
    );
    expect(mockLogger.warn).toHaveBeenCalledWith(
      expect.stringMatching(/S3アップロード最大回数に達しました/)
    );

    expect(result.fallbackDisplayMode).toBe('HTML');
    expect(result.htmlContent).toMatch(/<html/i);
    expect(result.htmlContent).toMatch(/<\/html>/i);
    expect(result.htmlContent).toContain('テスト顧客A');
    expect(result.htmlContent).toContain('成功パターン001');
    expect(result.htmlContent).toContain('段階的提案アプローチ');
    expect(result.htmlContent).toContain('過去5件の類似案件から抽出した成功パターン');

    expect(result.errorMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください'
    );

    expect(result.htmlContent).toMatch(/class="recommendation-pattern"/);
    expect(result.htmlContent).toMatch(/class="customer-name"/);
    expect(result.htmlContent).toMatch(/class="deal-condition"/);
    expect(result.htmlContent).toMatch(/class="proposal-approach"/);
    expect(result.htmlContent).toMatch(/class="reasoning-explanation"/);

    const htmlIsWellFormed = result.htmlContent.match(/<html/gi)?.length ===
      result.htmlContent.match(/<\/html>/gi)?.length;
    expect(htmlIsWellFormed).toBe(true);

    expect(result.uploadAttempts).toBe(2);
    expect(result.maxRetries).toBe(2);
    expect(result.isBrowserSaveAvailable).toBe(true);
  });
});