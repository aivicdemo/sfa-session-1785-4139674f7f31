import { generateRecommendationWithFallback } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - S3アップロード失敗時のHTML表示代替動作', () => {
  test('SCEN-932: S3アップロード失敗時に推奨内容がHTML形式で画面表示される', async () => {
    // Arrange: テスト用のモックデータとスタブの準備
    const mockCustomerData = {
      customerId: 'CUST-001',
      customerName: '株式会社テスト',
      industry: '製造業',
      scale: '大企業',
      contactHistory: 3,
    };

    const mockDealConditions = {
      dealId: 'DEAL-932-001',
      productCategory: 'クラウドERP',
      estimatedValue: 5000000,
      targetCloseDate: '2024-12-31',
      dealStage: '提案中',
    };

    // OpenAI APIスタブ: 正常に推奨内容を返す
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '既存ERPシステムからのスムーズな移行を重視した段階的導入アプローチ',
        confidenceScore: 85,
        reasoning: '同業種の大規模企業での成功事例が3件あり、クラウドERP導入時の運用課題を解決した実績がある',
        recommendations: [
          '導入前の現行システム分析を実施',
          '段階的なモジュール導入を提案',
          '運用チーム向けトレーニングを含める',
        ],
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([
        { patternId: 'PAT-001', similarity: 92, successRate: 0.95 },
        { patternId: 'PAT-002', similarity: 88, successRate: 0.90 },
      ]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(
        '過去の類似案件5件から抽出した成功パターンに基づいて提案アプローチを推奨しています'
      ),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0.87),
    };

    // FileStorageAdapterスタブ: アップロード失敗を模擬（最大3回の試行失敗）
    const uploadAttempts = { count: 0 };
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockImplementation(async () => {
        uploadAttempts.count += 1;
        if (uploadAttempts.count <= 3) {
          const error = new Error('Connection timeout: Unable to connect to S3');
          (error as any).code = 'ECONNABORTED';
          throw error;
        }
        return { url: 'https://s3.example.com/report-932.pdf' };
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    // Act: 推奨生成を実行（S3アップロード失敗時の代替動作を含む）
    const result = await generateRecommendationWithFallback(
      mockCustomerData,
      mockDealConditions,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    // Assert: S3アップロードが最大3回試行されたことを確認
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // Assert: アップロード失敗後、HTML形式で推奨内容が返されていることを確認
    expect(result).toHaveProperty('htmlContent');
    expect(result.displayMode).toBe('html');
    expect(result.fallbackActive).toBe(true);

    // Assert: 推奨内容（OpenAI APIから取得した内容）がHTML内に含まれていることを確認
    expect(result.htmlContent).toContain('既存ERPシステムからのスムーズな移行を重視した段階的導入アプローチ');
    expect(result.htmlContent).toContain('confidenceScore');
    expect(result.htmlContent).toContain('85');

    // Assert: エラーメッセージがHTML内に含まれていることを確認
    expect(result.htmlContent).toContain('レポート生成に失敗しました');
    expect(result.htmlContent).toContain('画面上で推奨内容を確認するか、後ほど再度お試しください');

    // Assert: HTML内容がユーザーのブラウザ保存機能で取得可能な形式であることを確認
    expect(result.htmlContent).toContain('<!DOCTYPE html>');
    expect(result.htmlContent).toContain('</html>');
    expect(result.canBrowserSave).toBe(true);

    // Assert: S3へのアップロードが実行されていないことを確認
    expect(result.s3Uploaded).toBe(false);

    // Assert: レポートファイルメタデータが登録されていないことを確認
    expect(result.metadataRegistered).toBe(false);
    expect(result.metadataId).toBeUndefined();

    // Assert: 推奨内容の根拠説明がHTML内に含まれていることを確認
    expect(result.htmlContent).toContain('同業種の大規模企業での成功事例が3件あり');

    // Assert: 推奨内容の信頼度スコア（0～100）が表示されていることを確認
    expect(result.htmlContent).toContain('85');

    // Assert: ユーザーが後ほど再度試行可能な状態にあることを確認
    expect(result.retryAvailable).toBe(true);
  });
});