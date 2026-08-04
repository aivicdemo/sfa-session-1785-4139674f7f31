import { generateSuccessPatternTemplate } from '../../src/logic/it-1-br-3-1-1-1';

describe('成功パターンテンプレート設計機能', () => {
  // SCEN-2508
  test('参加者リストが空配列のとき、テンプレート生成がValidationErrorをスロー', () => {
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

    const emptyParticipantsRequest = {
      participants: [],
      successFactors: ['顧客ニーズの深い理解', '提案内容のカスタマイズ'],
      failureFactors: ['標準提案の押し付け', 'フォローアップの不足'],
      customerAttributes: {
        industry: '製造業',
        scale: '中堅企業',
      },
      productCategory: 'ERP',
      templateName: 'テスト成功パターン',
    };

    expect(() =>
      generateSuccessPatternTemplate(
        emptyParticipantsRequest,
        mockAIRecommendationEngine,
        mockFileStorageAdapter
      )
    ).toThrow(/参加者リストが空です/);

    expect(mockAIRecommendationEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIRecommendationEngine.evaluatePatternRelevance).not.toHaveBeenCalled();
    expect(mockFileStorageAdapter.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});