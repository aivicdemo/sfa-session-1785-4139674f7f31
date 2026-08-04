import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - レポート生成・出力機能', () => {
  // SCEN-1702
  test('Amazon S3がタイムアウトしたとき、代替処理が実行される', async () => {
    // Setup: S3スタブを作成（タイムアウト遅延を返す）
    const mockS3Adapter = {
      uploadRecommendationReport: jest.fn(async () => {
        // 30秒以上の遅延をシミュレート
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('Request timeout after 30 seconds'));
          }, 31000);
        });
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const recommendationData = {
      customerId: 'CUST-001',
      dealId: 'DEAL-20240115-001',
      recommendationContent: {
        approach: 'Phased implementation strategy',
        timing: '2024-02-15',
        reasoning: 'Customer cashflow analysis indicates Q1 budget availability',
        confidenceScore: 85,
      },
      recommendationReasoning: {
        pastCaseExample: 'CASE-2023-0512',
        customerDataFactors: ['Industry: Manufacturing', 'Company Size: 500-1000 employees'],
        successPatternMatch: 'Pattern-A1: Similar customer segment with 78% success rate',
      },
    };

    const retryConfig = {
      maxRetries: 3,
      initialDelayMs: 1000,
      backoffMultiplier: 2,
      timeoutMs: 30000,
    };

    // Execute: レポート生成・出力機能を呼び出し
    const result = await generateRecommendationReport(
      recommendationData,
      mockS3Adapter,
      retryConfig
    );

    // Assert: 指数バックオフ再試行ロジックが実行されたことを確認
    // 1回目失敗 → 1秒待機 → 2回目失敗 → 2秒待機 → 3回目失敗 → 代替処理
    expect(mockS3Adapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    // Assert: 代替処理が発動し、HTMLレスポンスが返却されたことを確認
    expect(result).toHaveProperty('fallbackApplied');
    expect(result.fallbackApplied).toBe(true);

    // Assert: HTMLレポートが生成されたことを確認
    expect(result).toHaveProperty('htmlReport');
    expect(typeof result.htmlReport).toBe('string');
    expect(result.htmlReport).toContain('<!DOCTYPE html>');
    expect(result.htmlReport).toContain(recommendationData.recommendationContent.approach);

    // Assert: ユーザーメッセージが正しく生成されたことを確認
    expect(result).toHaveProperty('userMessage');
    expect(result.userMessage).toMatch(/レポート生成に失敗しました/);
    expect(result.userMessage).toMatch(/画面上で推奨内容を確認するか/);
    expect(result.userMessage).toMatch(/後ほど再度お試しください/);

    // Assert: ブラウザ保存機能対応（HTMLコンテンツタイプとメタ情報が適切に設定されているか）
    expect(result).toHaveProperty('downloadable');
    expect(result.downloadable).toBe(true);

    // Assert: HTMLレポートにレコメンデーション内容が含まれていることを確認（ブラウザ保存後も情報が損失しないことを保証）
    expect(result.htmlReport).toContain(recommendationData.customerId);
    expect(result.htmlReport).toContain(recommendationData.dealId);
    expect(result.htmlReport).toContain(String(recommendationData.recommendationContent.confidenceScore));
    expect(result.htmlReport).toContain(recommendationData.recommendationReasoning.pastCaseExample);

    // Assert: エラー情報がログされているか（監査証跡の確保）
    expect(result).toHaveProperty('errorLog');
    expect(result.errorLog).toBeInstanceOf(Array);
    expect(result.errorLog.length).toBeGreaterThanOrEqual(3);
    expect(result.errorLog[0]).toMatch(/timeout/i);
  });
});