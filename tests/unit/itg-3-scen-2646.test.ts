import { generateRecommendationReport } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2646
  test('推奨レポート生成時にファイル形式が指定されていないとき、生成エラーがスローされる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn().mockReturnValue({
        recommendationId: 'rec-001',
        customerName: 'テスト顧客',
        proposalContent: '提案内容',
        confidenceScore: 85,
        reasoningBasis: ['過去事例との一致度が高い']
      }),
      findSimilarPatterns: jest.fn().mockReturnValue([]),
      explainRecommendationReasoning: jest.fn().mockReturnValue('推奨理由の説明'),
      evaluatePatternRelevance: jest.fn().mockReturnValue(0.9)
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn()
    };

    const recommendationInput = {
      customerId: 'cust-001',
      dealId: 'deal-001',
      customerIndustry: 'IT',
      customerScale: 'large'
    };

    expect(() => {
      generateRecommendationReport(
        recommendationInput,
        null,
        mockAIEngine,
        mockFileStorageAdapter
      );
    }).toThrow(/ファイル形式/);

    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});