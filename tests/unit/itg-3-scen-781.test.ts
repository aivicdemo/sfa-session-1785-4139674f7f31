import { generateRecommendationReportWithFallback } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-781
  test('推奨内容レポート生成・保存機能(ファイルストレージ失敗時の振る舞い)', () => {
    const mockRecommendationData = {
      recommendationId: 'rec-001',
      customerId: 'cust-123',
      proposalApproach: '顧客の業種・規模に基づいた提案アプローチの推奨',
      similarPatterns: [
        {
          patternId: 'pat-001',
          matchScore: 0.92,
          successRate: 0.87,
          description: '類似顧客事例1'
        },
        {
          patternId: 'pat-002',
          matchScore: 0.85,
          successRate: 0.81,
          description: '類似顧客事例2'
        }
      ],
      recommendationReasoningText: '過去3件の類似案件で78%の成功率を記録。顧客業種「製造業」、規模「従業員500名」のセグメントでは当提案アプローチが最適。',
      confidenceScore: 85,
      generatedAt: new Date('2024-01-15T11:00:00Z'),
      riskFactors: [
        {
          riskId: 'risk-001',
          description: '導入スケジュール制約',
          mitigationStrategy: '段階導入プラン提案'
        }
      ]
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn().mockRejectedValueOnce(
        new Error('AccessDenied')
      ),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    const result = generateRecommendationReportWithFallback(
      mockRecommendationData,
      mockFileStorageAdapter
    );

    expect(mockFileStorageAdapter.uploadRecommendationReport).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(false);
    expect(result.errorMessage).toBe(
      'レポート生成に失敗しました。画面上で推奨内容を確認するか、後ほど再度お試しください'
    );
    expect(result.fallbackHtmlContent).toBeDefined();
    expect(typeof result.fallbackHtmlContent).toBe('string');
    expect(result.fallbackHtmlContent).toContain('<!DOCTYPE html>');
    expect(result.fallbackHtmlContent).toContain(mockRecommendationData.proposalApproach);
    expect(result.fallbackHtmlContent).toContain(
      mockRecommendationData.recommendationReasoningText
    );
    expect(result.fallbackHtmlContent).toContain('85');
    expect(result.errorLog).toBeDefined();
    expect(result.errorLog.failureReason).toContain('AccessDenied');
    expect(result.errorLog.timestamp).toBeDefined();
  });
});