import { generateSuccessPatternTemplate } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-2515
  test("営業プロセスステップ間の依存関係が循環参照を含むとき、テンプレート生成がエラーになる", () => {
    const circularSteps = [
      {
        stepId: "stepA",
        stepName: "初回接触",
        dependencies: ["stepB"],
      },
      {
        stepId: "stepB",
        stepName: "ニーズ把握",
        dependencies: ["stepC"],
      },
      {
        stepId: "stepC",
        stepName: "提案実施",
        dependencies: ["stepA"],
      },
    ];

    const mockAIEngine = {
      generateRecommendation: jest.fn().mockImplementation(() => {
        throw new Error(
          "CIRCULAR_DEPENDENCY_ERROR: ステップA→ステップB→ステップC→ステップA"
        );
      }),
      findSimilarPatterns: jest.fn(),
      explainRecommendationReasoning: jest.fn(),
      evaluatePatternRelevance: jest.fn(),
    };

    const templateInput = {
      processSteps: circularSteps,
      successCriteria: {
        conversionRateTarget: 0.6,
        timelineTarget: 30,
      },
    };

    expect(() =>
      generateSuccessPatternTemplate(templateInput, mockAIEngine)
    ).toThrow(/循環参照/);
  });
});