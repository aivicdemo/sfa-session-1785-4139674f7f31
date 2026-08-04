import { decideSalesPersonGuidance } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定機能', () => {
  test('SCEN-498: 営業担当者IDがnullのとき、バリデーションエラーを発生させる', () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorage = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    const input = {
      salesPersonId: null,
      customerInfo: {
        customerId: 'CUST-001',
        customerName: 'テスト株式会社',
        industry: '製造業',
        scale: 'large',
      },
      dealCondition: {
        dealId: 'DEAL-2024-001',
        dealStage: 'proposal',
        proposalAmount: 5000000,
      },
      dataQualityScore: 95,
      aiRecommendationEngine: mockAIEngine,
      fileStorageAdapter: mockFileStorage,
    };

    expect(() => decideSalesPersonGuidance(input)).toThrow(/salesPersonId|INVALID_SALESPERSON_ID/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(mockFileStorage.generateDownloadUrl).not.toHaveBeenCalled();
    expect(mockFileStorage.deleteExpiredReports).not.toHaveBeenCalled();
  });
});