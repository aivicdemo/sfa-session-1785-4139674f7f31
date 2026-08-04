import { visualizeRecommendationRationale } from "../../src/logic/it-1-br-3-1-1-1";

describe("AIエージェントの推奨根拠の可視化機能", () => {
  // SCEN-1762
  test("同じ入力で2回実行したとき根拠リストが同じ順序で返る", () => {
    const mockAIEngine = {
      explainRecommendationReasoning: jest.fn(() => ({
        rationales: [
          "過去成功率85%の顧客層に該当",
          "商談規模が平均値以上",
          "提案時期が最適季節",
        ],
      })),
    };

    const input1 = {
      industryCode: "manufacturing",
      dealAmount: 5000000,
      stageName: "提案準備",
    };

    const result1 = visualizeRecommendationRationale(input1, mockAIEngine);
    const result2 = visualizeRecommendationRationale(input1, mockAIEngine);

    const expected = [
      "過去成功率85%の顧客層に該当",
      "商談規模が平均値以上",
      "提案時期が最適季節",
    ];

    expect(result1).toEqual(expected);
    expect(result2).toEqual(expected);
    expect(result1).toEqual(result2);
  });
});