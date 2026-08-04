import { calculateTrustScoreAndReasoning } from '../../src/logic/it-1-br-3-1-1-1';

describe('AIエージェント推奨根拠の可視化機能', () => {
  // SCEN-827
  test('[error] 推奨内容の信頼度スコア算出・根拠提示機能 - 提案内容データが null のとき、エラーで処理が進まない', () => {
    const nullProposalData = null;
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

    expect(() => {
      calculateTrustScoreAndReasoning(
        nullProposalData,
        mockAIEngine,
        mockFileStorage
      );
    }).toThrow(/提案内容データ/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});