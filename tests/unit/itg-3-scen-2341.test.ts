import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェント推奨根拠の可視化機能", () => {
  // SCEN-2341
  test("OpenAI API呼び出しが失敗し3回までの指数バックオフ再試行全て失敗するとき簡略版説明文が返却される", async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(),
    };

    let callCount = 0;
    mockAIEngine.explainRecommendationReasoning.mockImplementation(() => {
      callCount++;
      if (callCount <= 3) {
        const delays = [1000, 2000, 4000];
        const currentDelay = delays[callCount - 1];
        return new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error("OpenAI API connection failed"));
          }, currentDelay);
        });
      }
    });

    const recommendationPatternId = "pattern_001";
    const customerInfo = {
      industryCode: "5010",
      companySizeCode: "large",
      companyName: "Sample Corp",
    };
    const dealConditions = {
      dealStageCode: "proposal",
      estimatedContractValue: 5000000,
      dealProgressDays: 30,
    };

    const result = await explainRecommendationReasoning(
      recommendationPatternId,
      customerInfo,
      dealConditions,
      mockAIEngine
    );

    expect(callCount).toBe(3);
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
    expect(result).toMatch(/同業界/);
    expect(result).toMatch(/導入実績/);
    expect(result).not.toMatch(/エラー/);
    expect(result.length).toBeGreaterThan(0);
    expect(result.length).toBeLessThan(500);
  });
});