import { recordRecommendationHistory } from '../../src/logic/it-1-br-3-3-2-1';

describe('推奨履歴記録機能 - 承認ステータス検証', () => {
  // SCEN-257
  test('承認ステータスが定義済みの値以外のときエラーを発生させる', () => {
    const invalidRecommendation = {
      recommendationId: 'rec-001',
      customerId: 'cust-001',
      dealId: 'deal-001',
      proposedApproach: 'テスト提案アプローチ',
      confidenceScore: 85,
      approvalStatus: 'invalid_status',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      rationale: '過去事例から抽出した提案',
    };

    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn().mockResolvedValue(invalidRecommendation),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const fileStorageAdapterStub = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    expect(() =>
      recordRecommendationHistory(
        invalidRecommendation,
        aiRecommendationEngineStub,
        fileStorageAdapterStub
      )
    ).toThrow(/承認ステータス/);
  });
});