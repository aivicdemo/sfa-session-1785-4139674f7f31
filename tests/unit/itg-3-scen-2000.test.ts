import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能 - 経営層向け説得資料自動生成', () => {
  test('SCEN-2000: 顧客企業IDが未設定（null）のとき、資料生成がエラーになる', () => {
    // Arrange
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

    const input = {
      customerCompanyId: null,
      proposalContent: '提案内容：AI導入による業務効率化',
      salesRepresentativeId: 'SR-001',
      analysisResult: {
        feasibility: 0.85,
        investmentROI: 2.5,
        riskFactors: ['導入リスク低'],
        recommendedActions: ['段階的な導入'],
      },
    };

    // Act & Assert
    expect(() => {
      generateExecutivePersuasionMaterial(
        input,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      );
    }).toThrow(/顧客企業ID/);

    // Verify that external services were NOT called
    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.generateDownloadUrl).not.toHaveBeenCalled();
  });
});