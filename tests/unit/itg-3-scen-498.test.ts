import { defineDecidingGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 指導方針の決定機能', () => {
  // SCEN-498
  test('営業担当者IDがnullのとき、バリデーションエラーが発生する', () => {
    const salesPersonIdNull = null;
    const customerInfo = {
      customerId: 'CUST001',
      customerName: '株式会社テスト',
      industry: 'IT',
      scale: 'large',
    };
    const dealConditions = {
      dealId: 'DEAL001',
      dealValue: 5000000,
      dealStage: 'proposal',
      dealTimeline: '2024-12-31',
    };

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

    expect(() =>
      defineDecidingGuidancePolicy(
        salesPersonIdNull,
        customerInfo,
        dealConditions,
        mockAIEngine,
        mockFileStorage
      )
    ).toThrow(/salesPersonId|営業担当者/i);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(mockFileStorage.generateDownloadUrl).not.toHaveBeenCalled();
    expect(mockFileStorage.deleteExpiredReports).not.toHaveBeenCalled();
  });
});