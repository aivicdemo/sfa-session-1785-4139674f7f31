import { validateRecommendationContent } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2882
  test('[error] uploadRecommendationReport失敗時にHTML形式でフォールバック表示される', () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockRejectedValue(
        new Error('S3 connection failed: Unable to access bucket')
      ),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const recommendationContent = {
      recommendationId: 'rec-20240115-001',
      customerId: 'cust-12345',
      dealId: 'deal-98765',
      recommendationText: '顧客の購買タイミングが最適化され、提案採用率が向上します',
      confidenceScore: 87,
      patterns: [
        {
          patternId: 'pat-001',
          patternName: '初回商談から30日以内フォローアップ',
          matchScore: 92,
          appliedCount: 15,
          successRate: 0.88,
        },
        {
          patternId: 'pat-002',
          patternName: '予算承認プロセス対応提案',
          matchScore: 81,
          appliedCount: 8,
          successRate: 0.75,
        },
      ],
      reasoning: [
        {
          factor: '顧客業種',
          evidence: '過去の類似製造業顧客の成約率が高い',
          weight: 0.35,
        },
        {
          factor: '商談段階',
          evidence: '提案段階での追加資料提供が有効',
          weight: 0.28,
        },
        {
          factor: 'タイミング',
          evidence: '月末決算期の提案が採用されやすい',
          weight: 0.22,
        },
        {
          factor: '競合状況',
          evidence: '競合がいない場合の成約率は95%',
          weight: 0.15,
        },
      ],
      generatedAt: '2024-01-15T11:30:00Z',
    };

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    const result = validateRecommendationContent(
      recommendationContent,
      mockFileStorageAdapter,
      mockAIRecommendationEngine
    );

    expect(result).toHaveProperty('fallbackMode', true);
    expect(result).toHaveProperty('format', 'html');

    const htmlContent = result.htmlContent;
    expect(htmlContent).toContain('<!DOCTYPE html>');
    expect(htmlContent).toContain(recommendationContent.recommendationText);
    expect(htmlContent).toContain('87');
    expect(htmlContent).toContain('初回商談から30日以内フォローアップ');
    expect(htmlContent).toContain('92');
    expect(htmlContent).toContain('予算承認プロセス対応提案');
    expect(htmlContent).toContain('81');
    expect(htmlContent).toContain('顧客業種');
    expect(htmlContent).toContain('過去の類似製造業顧客の成約率が高い');
    expect(htmlContent).toContain('0.35');
    expect(htmlContent).toContain('商談段階');
    expect(htmlContent).toContain('提案段階での追加資料提供が有効');
    expect(htmlContent).toContain('0.28');
    expect(htmlContent).toContain('</html>');

    expect(result).toHaveProperty('isDownloadable', true);
    expect(result).toHaveProperty('mimeType', 'text/html');

    expect(result).toHaveProperty('errorMessage');
    expect(result.errorMessage).toMatch(/FileStorageAdapter uploadRecommendationReport failed/);
    expect(result.errorMessage).toMatch(/Fallback to HTML display/);

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('FileStorageAdapter uploadRecommendationReport failed')
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Fallback to HTML display')
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);
    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledWith(
      expect.objectContaining({
        recommendationId: 'rec-20240115-001',
        customerId: 'cust-12345',
      })
    );

    consoleSpy.mockRestore();
  });
});