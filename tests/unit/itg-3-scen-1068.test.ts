import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  test('SCEN-1068: [normal] 推奨レポートの生成と保存 - Amazon S3が正常応答した場合、推奨内容がExcel形式で保存される', async () => {
    // Mock AIRecommendationEngine.generateRecommendation
    const mockAiEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        proposalApproach: '顧客の課題に基づく提案順序',
        rationale: '過去成功パターンマッチ度85%',
        confidenceScore: 0.85,
        recommendationId: 'ABC商社_20260801',
        customerName: 'ABC商社',
        dealAmount: 5000000,
        industry: '製造業',
        timestamp: '2026-08-01T12:00:00Z',
      }),
    };

    // Mock FileStorageAdapter.uploadRecommendationReport
    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        status: 200,
        fileKey: 'recommendation_report_20260801_001.xlsx',
        fileSize: 102400,
        uploadedAt: '2026-08-01T12:00:00Z',
      }),
    };

    // Input: 新規案件情報
    const newDealInput = {
      customerName: 'ABC商社',
      dealAmount: 5000000,
      industry: '製造業',
      dealId: 'ABC商社_20260801',
    };

    // Execute: 推奨レポート生成・保存処理
    const result = await generateRecommendationReport(
      newDealInput,
      mockAiEngine,
      mockFileStorage
    );

    // Verify: uploadRecommendationReportが呼び出されたことを確認
    expect(mockFileStorage.uploadRecommendationReport).toHaveBeenCalled();

    // Verify: uploadRecommendationReportに渡された引数を検証
    const uploadCallArgs = mockFileStorage.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadCallArgs.fileName).toMatch(/\.xlsx$/);

    // Verify: アップロード後のシステム内部状態を検証
    expect(result).toEqual({
      fileKey: 'recommendation_report_20260801_001.xlsx',
      generationDate: '2026-08-01T12:00:00Z',
      status: '保存完了',
      recommendationId: 'ABC商社_20260801',
      fileSize: 102400,
      proposalApproach: '顧客の課題に基づく提案順序',
      rationale: '過去成功パターンマッチ度85%',
      confidenceScore: 0.85,
    });

    // Verify: レポートメタデータが正しい値であることを確認
    expect(result.status).toBe('保存完了');
    expect(result.fileKey).toBe('recommendation_report_20260801_001.xlsx');
    expect(result.fileSize).toBeGreaterThan(0);
    expect(result.confidenceScore).toBe(0.85);
  });
});