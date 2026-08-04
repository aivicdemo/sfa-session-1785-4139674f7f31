import { explainRecommendationReasoning } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1922
  test("顧客IDが空文字列のときに根拠が生成されない", async () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(async (customerId: string) => {
        if (customerId === "") {
          return null;
        }
        return {
          reasoning: "Sample reasoning",
          confidence: 85,
        };
      }),
    };

    const logMessages: string[] = [];
    const mockLogger = {
      info: jest.fn((message: string) => {
        logMessages.push(message);
      }),
    };

    const customerId = "";
    const dealCondition = {
      dealId: "DEAL-001",
      customerIndustry: "IT",
      dealAmount: 500000,
      dealStage: "proposal",
    };

    const result = await explainRecommendationReasoning(
      customerId,
      dealCondition,
      mockAIEngine,
      mockLogger
    );

    expect(mockAIEngine.explainRecommendationReasoning).toHaveBeenCalledWith(
      ""
    );
    expect(result).toBeNull();
    expect(logMessages.some((msg) => msg.includes("顧客ID"))).toBe(true);
  });
});