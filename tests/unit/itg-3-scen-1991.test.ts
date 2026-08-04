import { generateExecutivePersuasionMaterial } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェントの推奨根拠の可視化機能 - 経営層向け説得資料生成', () => {
  // SCEN-1991
  test('顧客制約条件が null のとき、資料生成がエラーになる', () => {
    const mockAIEngine = {
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
      customerName: 'テスト株式会社',
      industry: '製造業',
      proposalContent: '提案内容テスト',
      customerConstraints: null,
    };

    expect(() =>
      generateExecutivePersuasionMaterial(input, mockAIEngine, mockFileStorageAdapter)
    ).toThrow(/顧客制約条件/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});