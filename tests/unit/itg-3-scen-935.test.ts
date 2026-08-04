import { recommendDeal } from '../../src/logic/it-1-br-3-3-2-1';

describe('AIエージェント推奨支援システム - 商談条件マスタ合致0件時のデフォルト条件自動適用', () => {
  // SCEN-935
  test('商談条件マスタから現在の案件に合致する条件が0件の場合、デフォルト条件が適用されて推奨処理が継続される', async () => {
    const dealConditions = [];
    const defaultPatterns = [
      {
        patternId: 'DEFAULT_001',
        successRate: 78.5,
        description: '標準推奨パターンA',
        appliedCount: 145,
      },
      {
        patternId: 'DEFAULT_002',
        successRate: 76.2,
        description: '標準推奨パターンB',
        appliedCount: 132,
      },
      {
        patternId: 'DEFAULT_003',
        successRate: 74.8,
        description: '標準推奨パターンC',
        appliedCount: 118,
      },
    ];

    const aiEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'REC-20240115-001',
        proposalApproach: '標準提案アプローチA',
        confidenceScore: 82,
        reasoning: '標準推奨パターンに基づく推奨',
        appliedPatterns: ['DEFAULT_001', 'DEFAULT_002'],
        nextActions: ['初回面談スケジュール確保', '顧客課題ヒアリング実施'],
        estimatedSuccessProbability: 0.78,
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue({
        explanation: '標準推奨パターンに基づく推奨',
      }),
      evaluatePatternRelevance: jest.fn().mockResolvedValue({
        relevanceScore: 0.82,
        applicability: true,
      }),
    };

    const fileStorageStub = {
      uploadRecommendationReport: jest
        .fn()
        .mockResolvedValue({
          fileUrl: 'https://s3.example.com/reports/REC-20240115-001.pdf',
          uploadedAt: '2024-01-15T11:00:00Z',
        }),
      generateDownloadUrl: jest.fn().mockResolvedValue({
        downloadUrl: 'https://s3.example.com/download?token=abc123',
        expiresAt: '2024-01-15T12:00:00Z',
      }),
      deleteExpiredReports: jest.fn().mockResolvedValue({
        deletedCount: 0,
      }),
    };

    const currentDeal = {
      dealId: 'DEAL-20240115-001',
      customerIndustry: '製造業',
      dealSize: 5000000,
      decisionDeadlineDays: 30,
      customerName: 'テスト製造企業',
      contactPerson: '営業担当者A',
    };

    const result = await recommendDeal(
      currentDeal,
      dealConditions,
      defaultPatterns,
      aiEngineStub,
      fileStorageStub
    );

    expect(result.recommendationId).toBe('REC-20240115-001');
    expect(result.proposalApproach).toBe('標準提案アプローチA');
    expect(result.confidenceScore).toBe(82);
    expect(result.reasoning).toBe('標準推奨パターンに基づく推奨');
    expect(result.appliedPatterns).toEqual(['DEFAULT_001', 'DEFAULT_002']);
    expect(result.appliedPatterns.length).toBe(2);
    expect(result.nextActions).toContain('初回面談スケジュール確保');
    expect(result.nextActions).toContain('顧客課題ヒアリング実施');
    expect(result.estimatedSuccessProbability).toBe(0.78);
    expect(result.fileUrl).toBe('https://s3.example.com/reports/REC-20240115-001.pdf');
    expect(result.uploadedAt).toBe('2024-01-15T11:00:00Z');
    expect(result.usedDefaultPatterns).toBe(true);

    expect(aiEngineStub.generateRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({
        dealId: 'DEAL-20240115-001',
        customerIndustry: '製造業',
        dealSize: 5000000,
        decisionDeadlineDays: 30,
        appliedPatterns: ['DEFAULT_001', 'DEFAULT_002', 'DEFAULT_003'],
      })
    );

    expect(fileStorageStub.uploadRecommendationReport).toHaveBeenCalled();
  });
});