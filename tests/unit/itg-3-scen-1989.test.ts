import { generatePersuasionMaterialForExecutives } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨支援システム - 経営層向け説得資料生成', () => {
  test('SCEN-1989: 提案内容が空文字列のとき、資料生成がエラーになる', () => {
    const customerInfo = {
      customerName: 'テスト顧客',
      industry: 'IT',
      scale: 'enterprise',
      challenge: '営業効率化',
    };
    const proposalContent = '';

    const mockAiEngine = {
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
      generatePersuasionMaterialForExecutives(
        customerInfo,
        proposalContent,
        mockAiEngine,
        mockFileStorage
      )
    ).toThrow(/提案内容/);

    expect(mockAiEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});