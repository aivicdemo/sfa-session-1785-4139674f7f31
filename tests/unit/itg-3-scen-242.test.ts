import { displayRecommendationWithFallback } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  test('SCEN-242: FileStorageAdapter.uploadRecommendationReport が2回連続で失敗したとき、HTML形式で画面表示に切り替わる', async () => {
    // Arrange: 推奨内容データを準備
    const recommendationContent = {
      recommendationId: 'REC-20240815-001',
      customerId: 'CUST-12345',
      dealId: 'DEAL-67890',
      proposalApproach: 'Enterprise digital transformation strategy with phased implementation',
      successPatternMatched: {
        industryType: 'Manufacturing',
        companySize: 'Large',
        decisionMaker: 'CTO',
      },
      confidenceScore: 87,
      baseDataPoints: [
        {
          dataType: 'past_case',
          description: 'Similar case with company A in automotive industry',
          matchScore: 0.92,
        },
        {
          dataType: 'customer_profile',
          description: 'Company budget allocation aligns with proposal scale',
          matchScore: 0.85,
        },
      ],
      recommendedTimingDays: 14,
      estimatedAdoptionProbability: 0.87,
    };

    // Arrange: FileStorageAdapter スタブを作成し、両方のアップロード試行で失敗するようモック設定
    let uploadAttemptCount = 0;
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(async () => {
        uploadAttemptCount++;
        // 1回目と2回目の再試行どちらもS3 API呼び出しエラーをシミュレート
        const error = new Error('ServiceUnavailable');
        (error as any).code = 'ServiceUnavailable';
        throw error;
      }),
    };

    // Act & Assert: フォールバック処理が発動し、HTML形式で画面表示されることを確認
    const result = await displayRecommendationWithFallback(
      recommendationContent,
      mockFileStorageAdapter
    );

    // 再試行が2回行われたことを確認（初回1回 + 再試行2回 = 最大3回中、2回の再試行を含む）
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);

    // フォールバック処理によりHTML形式が返されていることを確認
    expect(result.displayFormat).toBe('html');

    // HTML形式の推奨レポートが生成されていることを確認
    expect(result.htmlContent).toBeDefined();
    expect(typeof result.htmlContent).toBe('string');

    // HTMLコンテンツに推奨内容の重要情報が含まれていることを確認
    expect(result.htmlContent).toContain('Enterprise digital transformation strategy');
    expect(result.htmlContent).toContain('87');
    expect(result.htmlContent).toContain('Manufacturing');

    // ユーザーがブラウザの保存機能で取得可能な状態であることを確認
    expect(result.isDownloadableViaRawHTML).toBe(true);

    // エラーメッセージが適切に設定されていることを確認
    expect(result.fallbackMessage).toContain('レポート生成に失敗しました');
  });
});