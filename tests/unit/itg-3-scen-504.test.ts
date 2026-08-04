import { decideSalesGuidancePolicy } from '../../src/logic/itg-3';

describe('AIエージェント推奨支援システム - 営業担当者への指導方針決定', () => {
  test('SCEN-504: 指導対象項目が空配列のとき、ValidationErrorがスローされる', () => {
    const salesPersonId = 'SP001';
    const dealInfo = {
      dealId: 'DEAL20240115001',
      customerId: 'CUST001',
      dealAmount: 5000000,
      dealStage: 'proposal',
      createdAt: new Date('2024-01-15T10:00:00Z'),
    };
    const guidanceItems: string[] = [];

    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockFileStorageAdapter = {
      uploadRecommendationReport: jest.fn(),
      generateDownloadUrl: jest.fn(),
      deleteExpiredReports: jest.fn(),
    };

    expect(() =>
      decideSalesGuidancePolicy(
        salesPersonId,
        dealInfo,
        guidanceItems,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      )
    ).toThrow(/guidanceItems|指導対象項目/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});