import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠説明機能", () => {
  // SCEN-2137
  test("推奨根拠データがnullのとき、エラーが発生する", () => {
    const nullReasoningData = null;

    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    expect(() => {
      explainRecommendationReasoning(nullReasoningData, mockAIEngine);
    }).toThrow(/推奨根拠データ|reasoningData/);
  });
});