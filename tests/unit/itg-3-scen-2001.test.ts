import { generatePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能', () => {
  // SCEN-2001
  test('提案IDが未設定（null）のとき、資料生成がエラーになる', () => {
    const proposalId = null;
    const customerInfo = {
      customerId: 'CUST001',
      customerName: 'テスト顧客A',
      industry: '製造業',
      companySize: 'large',
      contactPerson: '営業太郎'
    };
    const proposalContent = {
      proposalTitle: 'コスト削減提案',
      overview: 'テスト概要',
      proposedProducts: ['製品A', '製品B'],
      estimatedCost: 1000000,
      expectedROI: 0.25
    };

    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn()
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn()
    };

    expect(() =>
      generatePersuasionMaterial(
        proposalId,
        customerInfo,
        proposalContent,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/提案ID/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});