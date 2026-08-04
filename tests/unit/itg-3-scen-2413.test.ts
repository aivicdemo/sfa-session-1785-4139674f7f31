import { calculateInferenceAccuracyScore } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2413: [error] 推論精度スコア算出機能 - 照合評価結果が空のとき、エラーが発生する
  test("照合評価結果が空のオブジェクトのとき、ValidationErrorを発生させる", () => {
    const aiRecommendationEngineStub = {
      generateRecommendation: jest.fn(),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn().mockReturnValue({}),
    };

    const evaluationResult = {};

    expect(() =>
      calculateInferenceAccuracyScore(evaluationResult, aiRecommendationEngineStub)
    ).toThrow(/照合評価結果/);
  });
});