import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - ファイルアップロード失敗時のフォールバック', () => {
  // SCEN-1381: [error] 推奨レポート生成・保存機能 - FileStorageAdapter の uploadRecommendationReport が失敗したとき HTML 形式で画面表示する
  test('ファイルアップロード失敗時にHTML形式で推奨内容を画面表示する', async () => {
    const customerName = 'テスト株式会社';
    const dealCondition = '予算1000万円、導入期間3ヶ月';
    const recommendedApproach = 'クラウド導入プラン';
    const reasoningBasis = '過去の類似案件で70%の成功率を達成。顧客の規模と業種が合致。';

    const mockRecommendationContent = {
      customerId: 'CUST001',
      customerName: customerName,
      dealCondition: dealCondition,
      recommendedApproach: recommendedApproach,
      reasoningBasis: reasoningBasis,
      confidenceScore: 85,
    };

    let uploadAttemptCount = 0;

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockImplementation(async () => {
        uploadAttemptCount++;
        throw new Error('Network error during upload');
      }),
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue(mockRecommendationContent),
    };

    const result = await generateRecommendationReportWithFallback(
      mockRecommendationContent,
      mockFileStorageAdapter,
      mockAIEngine
    );

    expect(result.fallbackUsed).toBe(true);
    expect(result.htmlContent).toContain('<table');
    expect(result.htmlContent).toContain(customerName);
    expect(result.htmlContent).toContain(dealCondition);
    expect(result.htmlContent).toContain(recommendedApproach);
    expect(result.htmlContent).toContain(reasoningBasis);
    expect(result.htmlContent).toContain('<!DOCTYPE html>');
    expect(result.htmlContent).toContain('<html>');
    expect(result.htmlContent).toContain('</html>');
    expect(result.errorMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください'
    );
    expect(uploadAttemptCount).toBe(2);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(2);
  });
});