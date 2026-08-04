import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-2-1-1";

describe("AIエージェント推奨内容の根拠表示機能", () => {
  // SCEN-1861
  test("推奨内容が null のとき根拠表示に失敗する", () => {
    const mockAIRecommendationEngine = {
      generateRecommendation: jest.fn().mockResolvedValue({
        recommendation: null,
        reasoningId: "test-123",
      }),
      explainRecommendationReasoning: jest
        .fn()
        .mockImplementation(() => {
          throw new Error("推奨内容が取得できていないため、根拠を表示できません");
        }),
    };

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    expect(() => {
      mockAIRecommendationEngine.explainRecommendationReasoning({
        recommendation: null,
        reasoningId: "test-123",
      });
    }).toThrow(/推奨内容が取得できていないため、根拠を表示できません/);

    expect(consoleErrorSpy).toHaveBeenCalled();

    const callArgs = consoleErrorSpy.mock.calls[0];
    expect(callArgs[0]).toMatch(/推奨内容が取得できていないため、根拠を表示できません/);

    consoleErrorSpy.mockRestore();
  });
});