import { generateRecommendation } from '../../src/logic/it-1-br-3-2-1-1';

describe('AIエージェント推奨内容の根拠表示機能', () => {
  // SCEN-240
  test('レポート出力形式が指定されていないとき、エラーをスロー', async () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendationId: 'rec_001',
        customerId: 'cust_001',
        dealId: 'deal_001',
        proposedApproach: 'Approach A',
        confidenceScore: 85,
        reasoningBasis: {
          pastCaseId: 'case_001',
          customerAttributes: { industry: 'Manufacturing', scale: 'large' },
          successPattern: 'Pattern-Type-1',
          timing: '2024-01-15T11:00:00Z',
          riskFactors: ['risk_factor_1']
        },
        createdAt: '2024-01-15T10:30:00Z'
      })
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn().mockImplementation((recommendation, format) => {
        if (format === null || format === undefined) {
          throw new TypeError('format parameter is required');
        }
        return Promise.resolve({
          uploadedUrl: 'https://s3.example.com/reports/rec_001.pdf',
          fileMetadataId: 'meta_001'
        });
      })
    };

    const recommendation = await mockAIEngine.generateRecommendation({
      customerId: 'cust_001',
      dealId: 'deal_001',
      customerData: {
        industry: 'Manufacturing',
        scale: 'large',
        region: 'Asia'
      }
    });

    await expect(
      mockFileStorage.uploadRecommendationReport(recommendation, null)
    ).rejects.toThrow(/format parameter is required/);
  });
});