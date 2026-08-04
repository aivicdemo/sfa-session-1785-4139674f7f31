import { calculateTrustScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-822
  test("顧客購買シグナルデータが null のとき、ValidationError をスロー", () => {
    const mockAIEngine = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const mockLogger = {
      error: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
    };

    const inputParams = {
      customerPurchaseSignals: null,
      proposalContent: {
        productId: "PROD-001",
        proposalTitle: "カスタマイズソリューション",
        estimatedValue: 5000000,
      },
      recommendationContext: {
        industryType: "製造業",
        customerScale: "大企業",
        currentPhase: "初期提案",
      },
      aiRecommendationEngine: mockAIEngine,
      logger: mockLogger,
    };

    expect(() => calculateTrustScore(inputParams)).toThrow(/顧客購買シグナルデータ/);

    expect(mockAIEngine.generateRecommendation).not.toHaveBeenCalled();
    expect(mockAIEngine.findSimilarPatterns).not.toHaveBeenCalled();
    expect(mockAIEngine.explainRecommendationReasoning).not.toHaveBeenCalled();
    expect(mockAIEngine.evaluatePatternRelevance).not.toHaveBeenCalled();

    expect(mockLogger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        errorCode: "INVALID_INPUT_DATA_NULL",
        message: expect.stringMatching(/顧客購買シグナルデータ/),
      })
    );
  });
});