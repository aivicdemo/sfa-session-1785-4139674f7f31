import { evaluatePatternRelevance } from "../../src/logic/it-1-br-3-3-2-1";

describe("成功パターン抽出・重み付けルール生成機能", () => {
  // SCEN-2766
  test("顧客業種の相関スコアが正の値として計算される", async () => {
    const aiEngine = {
      evaluatePatternRelevance: jest.fn(async (args: {
        currentIndustry: string;
        pastSuccessIndustry: string;
      }) => {
        if (
          args.currentIndustry === "manufacturing" &&
          args.pastSuccessIndustry === "manufacturing"
        ) {
          return { relevanceScore: 0.95 };
        }
        if (
          args.currentIndustry === "it" &&
          args.pastSuccessIndustry === "finance"
        ) {
          return { relevanceScore: 0.42 };
        }
        return { relevanceScore: 0.0 };
      }),
    };

    const testCase1 = {
      currentIndustry: "manufacturing",
      pastSuccessIndustry: "manufacturing",
    };

    const result1 = await evaluatePatternRelevance(testCase1, aiEngine);

    expect(result1.relevanceScore).toBeGreaterThan(0);
    expect(result1.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(result1.relevanceScore).toBeGreaterThanOrEqual(0.9);

    const testCase2 = {
      currentIndustry: "it",
      pastSuccessIndustry: "finance",
    };

    const result2 = await evaluatePatternRelevance(testCase2, aiEngine);

    expect(result2.relevanceScore).toBeGreaterThan(0);
    expect(result2.relevanceScore).toBeLessThanOrEqual(1.0);
    expect(result2.relevanceScore).toBeGreaterThanOrEqual(0.1);
    expect(result2.relevanceScore).toBeLessThan(0.9);
  });
});