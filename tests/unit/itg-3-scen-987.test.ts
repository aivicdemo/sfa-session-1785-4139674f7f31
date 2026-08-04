import { generateRecommendationReport } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-987
  test("推奨内容が空オブジェクトのとき、レポート生成処理は開始されず警告が返される", () => {
    const emptyRecommendation = {};
    
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
    
    const result = generateRecommendationReport(
      emptyRecommendation,
      mockAIEngine,
      mockFileStorage
    );
    
    expect(result).toEqual({
      success: false,
      code: "INVALID_RECOMMENDATION_CONTENT",
      message: "推奨内容が空です。レポート生成を中止しました。",
    });
    
    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockFileStorage.uploadRecommendationReport).not.toHaveBeenCalled();
  });
});