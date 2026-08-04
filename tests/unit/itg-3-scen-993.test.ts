import { generateRecommendationReportWithReasons } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-993
  test('推奨レポート生成・保存機能 - 推奨根拠情報が0件のとき、レポート生成は進行するが根拠セクションが空で出力される', async () => {
    const recommendationId = 'rec-20240115-001';
    const generatedAt = new Date('2024-01-15T11:00:00Z');
    const customerName = 'テスト太郎';
    const dealAmount = 5000000;
    const industry = '製造業';

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: recommendationId,
        proposalApproach: '営業担当者の行動を標準プロセスに統一し、顧客対応パターンを成功事例と照合する',
        recommendationReasons: [],
        confidenceScore: 85,
        generatedAt: generatedAt,
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockResolvedValue({
        fileKey: 'reports/rec-20240115-001-report.pdf',
        uploadedAt: generatedAt,
        fileName: 'rec-20240115-001-report.pdf',
        fileSize: 45678,
      }),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const newDealData = {
      customerId: 'cust-12345',
      customerName: customerName,
      dealAmount: dealAmount,
      industry: industry,
      dealStage: 'proposal',
      dealDescription: 'テスト案件',
    };

    const result = await generateRecommendationReportWithReasons(
      newDealData,
      mockAIRecommendationEngine,
      mockFileStorageAdapter
    );

    expect(result.reportId).toBe(recommendationId);
    expect(result.generatedAt).toEqual(generatedAt);
    expect(result.proposalApproachSection).toBe(
      '営業担当者の行動を標準プロセスに統一し、顧客対応パターンを成功事例と照合する'
    );
    expect(result.reasonsSection).toEqual('');
    expect(result.confidenceScore).toBe(85);
    expect(result.uploadStatus).toBe('success');
    expect(result.fileMetadata.fileKey).toBe('reports/rec-20240115-001-report.pdf');
    expect(result.fileMetadata.fileSize).toBe(45678);

    expect(mockAIRecommendationEngine.generateRecommendation).toHaveBeenCalledWith(
      newDealData
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalled();
    const uploadCall = mockFileStorageAdapter.uploadRecommendationReport.mock.calls[0][0];
    expect(uploadCall).toHaveProperty('proposalApproachSection');
    expect(uploadCall).toHaveProperty('reasonsSection');
    expect(uploadCall.reasonsSection).toBe('');
  });
});