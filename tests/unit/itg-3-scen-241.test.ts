import { generateRecommendationReport } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能 - レポート出力形式検証', () => {
  // SCEN-241
  test('業務要件で未定義のレポート形式が指定されたとき、レポート生成処理はエラーを発生させ、FileStorageAdapter を呼び出さない', () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec-001',
        customerId: 'cust-12345',
        dealId: 'deal-98765',
        recommendedApproach: 'Direct negotiation with CFO',
        confidenceScore: 85,
        basis: {
          pastSuccessPatterns: ['Pattern A', 'Pattern B'],
          customerData: { industry: 'Finance', size: 'Large' },
          timingFactors: ['Q4 budget allocation'],
        },
        generatedAt: new Date('2024-10-15T14:30:00Z'),
      }),
      findSimilarPatterns: jest.fn().mockResolvedValue([]),
      explainRecommendationReasoning: jest.fn().mockResolvedValue(''),
      evaluatePatternRelevance: jest.fn().mockResolvedValue(0),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const recommendationData = {
      customerId: 'cust-12345',
      dealId: 'deal-98765',
      industry: 'Finance',
      companySize: 'Large',
    };

    const invalidReportFormat = 'JPG';

    expect(() =>
      generateRecommendationReport(
        recommendationData,
        invalidReportFormat,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      )
    ).toThrow(/形式/);

    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});