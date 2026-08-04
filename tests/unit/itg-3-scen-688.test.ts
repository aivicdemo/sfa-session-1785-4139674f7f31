import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-688
  test('S3アップロード失敗時にHTML形式で画面表示され、ユーザーがブラウザ保存機能で取得可能になる', async () => {
    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
        .mockRejectedValueOnce(new Error('NoSuchBucket'))
        .mockRejectedValueOnce(new Error('NoSuchBucket'))
        .mockRejectedValueOnce(new Error('NoSuchBucket')),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const recommendationData = {
      customer_name: 'A社',
      proposal_approach: 'クラウド移行支援',
      reasoning_basis: '過去成功事例3件マッチ',
      confidence_score: 85,
      timestamp: new Date('2024-01-15T11:00:00Z').toISOString(),
    };

    const result = await generateRecommendationReportWithFallback(
      recommendationData,
      mockFileStorageAdapter
    );

    expect(result.fallback_mode).toBe(true);
    expect(result.html_output).toBeDefined();
    expect(typeof result.html_output).toBe('string');

    expect(result.html_output).toMatch(/<html>/i);
    expect(result.html_output).toMatch(/<\/html>/i);
    expect(result.html_output).toContain('A社');
    expect(result.html_output).toContain('クラウド移行支援');
    expect(result.html_output).toContain('過去成功事例3件マッチ');

    expect(result.suggested_filename).toBe('recommendation_report_A社.html');

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(3);

    const uploadCalls = mockFileStorageAdapter.uploadRecommendationReport.mock.calls;
    expect(uploadCalls.length).toBe(3);
    uploadCalls.forEach((callArgs) => {
      expect(callArgs[0]).toMatchObject({
        customer_name: 'A社',
        proposal_approach: 'クラウド移行支援',
        reasoning_basis: '過去成功事例3件マッチ',
      });
    });

    expect(result.error_message).toMatch(/アップロードに失敗しました/);
    expect(result.download_url).toBeUndefined();
    expect(result.is_displayable_in_browser).toBe(true);
    expect(result.is_saveable_by_user).toBe(true);
  });
});